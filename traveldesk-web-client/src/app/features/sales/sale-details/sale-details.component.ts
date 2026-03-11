import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BookingRequest,
  BookingResponse,
  Currency,
  SaleRequest,
  SaleResponse,
} from "../../../core/models";
import { BookingsService } from "../../../core/services/bookings.service";
import { SalesService } from "../../../core/services/sales.service";
import { SuppliersService } from "../../../core/services/suppliers.service";

interface PaymentItem {
  id: string;
  amount: number;
  createdAt: string;
}

@Component({
  selector: "app-sale-details",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  templateUrl: "./sale-details.component.html",
})
export class SaleDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly salesSvc = inject(SalesService);
  readonly bookingsSvc = inject(BookingsService);
  readonly suppliersSvc = inject(SuppliersService);

  readonly sale = signal<SaleResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal("");

  readonly showAddBooking = signal(false);
  readonly editingBookingId = signal<string | null>(null);

  readonly payments = signal<PaymentItem[]>([]);

  readonly amountForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
  });

  readonly paymentForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
  });

  readonly bookingForm = this.fb.group({
    supplierId: ["", Validators.required],
    reference: ["", Validators.required],
    passengerName: ["", Validators.required],
    destination: ["", Validators.required],
    departureDate: ["", Validators.required],
    returnDate: [""],
    status: ["PENDING", Validators.required],
  });

  readonly saleBookings = computed(() => {
    const currentSale = this.sale();
    if (!currentSale) return [] as BookingResponse[];

    return this.bookingsSvc
      .bookings()
      .filter((b) => b.customerId === currentSale.customerId);
  });

  readonly currency = computed<Currency>(() => this.sale()?.currency ?? "USD");

  readonly paymentsReceived = computed(() =>
    this.payments().reduce((acc, p) => acc + p.amount, 0),
  );

  readonly pendingBalance = computed(() => {
    const total = this.sale()?.amount ?? 0;
    return total - this.paymentsReceived();
  });

  readonly gainAmount = computed(() => {
    const total = this.sale()?.amount ?? 0;
    return this.paymentsReceived() - total;
  });

  readonly gainPercent = computed(() => {
    const total = this.sale()?.amount ?? 0;
    if (!total) return 0;
    return (this.gainAmount() / total) * 100;
  });

  ngOnInit() {
    const saleId = this.route.snapshot.paramMap.get("id");
    if (!saleId) {
      this.error.set("No se encontró el id de la venta");
      this.loading.set(false);
      return;
    }

    this.salesSvc.getById(saleId).subscribe({
      next: (sale) => {
        this.sale.set(sale);
        this.amountForm.patchValue({ amount: sale.amount });
        this.bookingForm.patchValue({ destination: sale.destination });
        this.loadPayments(sale.id);

        this.bookingsSvc.loadAll().subscribe();
        this.suppliersSvc.loadAll().subscribe();

        this.loading.set(false);
      },
      error: () => {
        this.error.set("No se pudo cargar la venta");
        this.loading.set(false);
      },
    });
  }

  goBack() {
    this.router.navigate(["/app/sales"]);
  }

  updateAmount() {
    const currentSale = this.sale();
    if (!currentSale || this.amountForm.invalid) return;

    const dto: Partial<SaleRequest> = {
      amount: Number(this.amountForm.value.amount),
    };

    this.salesSvc.update(currentSale.id, dto).subscribe({
      next: (updated) => this.sale.set(updated),
      error: (err) => console.error("Error updating sale amount:", err),
    });
  }

  addPayment() {
    const currentSale = this.sale();
    if (!currentSale || this.paymentForm.invalid) return;

    const payment: PaymentItem = {
      id: crypto.randomUUID(),
      amount: Number(this.paymentForm.value.amount),
      createdAt: new Date().toISOString(),
    };

    this.payments.update((list) => [payment, ...list]);
    this.persistPayments(currentSale.id);
    this.paymentForm.reset({ amount: 0 });

    if (currentSale.status !== "CONFIRMED") {
      this.salesSvc.update(currentSale.id, { status: "CONFIRMED" }).subscribe({
        next: (updated) => this.sale.set(updated),
        error: (err) => console.error("Error updating sale status:", err),
      });
    }
  }

  removePayment(id: string) {
    const currentSale = this.sale();
    if (!currentSale) return;

    this.payments.update((list) => list.filter((p) => p.id !== id));
    this.persistPayments(currentSale.id);
  }

  openAddBooking() {
    const currentSale = this.sale();
    if (!currentSale) return;

    this.editingBookingId.set(null);
    this.showAddBooking.set(true);
    this.bookingForm.reset({
      supplierId: "",
      reference: "",
      passengerName: "",
      destination: currentSale.destination,
      departureDate: "",
      returnDate: "",
      status: "PENDING",
    });
  }

  editBooking(booking: BookingResponse) {
    this.editingBookingId.set(booking.id);
    this.showAddBooking.set(true);
    this.bookingForm.patchValue({
      supplierId: booking.supplierId,
      reference: booking.reference,
      passengerName: booking.passengerName,
      destination: booking.destination,
      departureDate: booking.departureDate,
      returnDate: booking.returnDate ?? "",
      status: booking.status,
    });
  }

  saveBooking() {
    const currentSale = this.sale();
    if (!currentSale || this.bookingForm.invalid) return;

    const value = this.bookingForm.value;
    const dto: BookingRequest = {
      customerId: currentSale.customerId,
      supplierId: value.supplierId ?? "",
      reference: value.reference ?? "",
      passengerName: value.passengerName ?? "",
      destination: value.destination ?? "",
      departureDate: value.departureDate ?? "",
      returnDate: value.returnDate || undefined,
      status: value.status ?? "PENDING",
    };

    const bookingId = this.editingBookingId();
    const request$ = bookingId
      ? this.bookingsSvc.update(bookingId, dto)
      : this.bookingsSvc.create(dto);

    request$.subscribe({
      next: () => {
        this.showAddBooking.set(false);
        this.editingBookingId.set(null);
      },
      error: (err) => console.error("Error saving booking:", err),
    });
  }

  deleteBooking(id: string) {
    this.bookingsSvc.delete(id).subscribe({
      error: (err) => console.error("Error deleting booking:", err),
    });
  }

  cancelSale() {
    const currentSale = this.sale();
    if (!currentSale || currentSale.status === "CANCELLED") return;

    this.salesSvc.update(currentSale.id, { status: "CANCELLED" }).subscribe({
      next: (updated) => this.sale.set(updated),
      error: (err) => console.error("Error cancelling sale:", err),
    });
  }

  getSupplierName(id: string): string {
    return this.suppliersSvc.suppliers().find((s) => s.id === id)?.name ?? "—";
  }

  private paymentsKey(saleId: string): string {
    return `td_sale_payments_${saleId}`;
  }

  private loadPayments(saleId: string) {
    const raw = localStorage.getItem(this.paymentsKey(saleId));
    if (!raw) {
      this.payments.set([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as PaymentItem[];
      this.payments.set(parsed);
    } catch {
      this.payments.set([]);
      localStorage.removeItem(this.paymentsKey(saleId));
    }
  }

  private persistPayments(saleId: string) {
    localStorage.setItem(
      this.paymentsKey(saleId),
      JSON.stringify(this.payments()),
    );
  }
}
