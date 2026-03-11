import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  BookingRequest,
  BookingResponse,
  Currency,
  SalePaymentRequest,
  SalePaymentResponse,
  SaleRequest,
  SaleResponse,
} from "../../../core/models";
import { BookingsService } from "../../../core/services/bookings.service";
import { ExchangeRateService } from "../../../core/services/exchange-rate.service";
import { SalesService } from "../../../core/services/sales.service";
import { SuppliersService } from "../../../core/services/suppliers.service";

type PaymentItem = SalePaymentResponse;

@Component({
  selector: "app-sale-details",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./sale-details.component.html",
})
export class SaleDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly salesSvc = inject(SalesService);
  readonly bookingsSvc = inject(BookingsService);
  readonly suppliersSvc = inject(SuppliersService);
  readonly xr = inject(ExchangeRateService);

  readonly sale = signal<SaleResponse | null>(null);
  readonly loading = signal(true);
  readonly error = signal("");

  readonly showAddBooking = signal(false);
  readonly showAddPayment = signal(false);
  readonly editingAmount = signal(false);
  readonly editingBookingId = signal<string | null>(null);

  readonly payments = signal<PaymentItem[]>([]);

  readonly amountForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
  });

  readonly paymentForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    currency: ["USD", Validators.required],
    description: ["", Validators.required],
    exchangeRate: [0],
  });

  readonly effectiveExchangeRate = computed(() => {
    const currentSaleCurrency = this.currency();
    const paymentCurrency = this.paymentForm.value.currency as Currency;
    if (!paymentCurrency || paymentCurrency === currentSaleCurrency) return 1;

    const override = Number(this.paymentForm.value.exchangeRate ?? 0);
    return override > 0
      ? override
      : this.defaultExchangeRate(paymentCurrency, currentSaleCurrency);
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

  readonly travelDate = computed<string | null>(() => {
    const bookings = this.saleBookings();
    if (!bookings.length) return null;
    return (
      bookings
        .map((b) => b.departureDate)
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b))[0] ?? null
    );
  });

  readonly paymentsReceived = computed(() =>
    this.payments().reduce(
      (acc, p) => acc + Number(p.convertedAmount ?? p.originalAmount ?? 0),
      0,
    ),
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
        this.xr.loadRate().subscribe();

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
      next: (updated) => {
        this.sale.set(updated);
        this.editingAmount.set(false);
      },
      error: (err) => console.error("Error updating sale amount:", err),
    });
  }

  addPayment() {
    const currentSale = this.sale();
    if (!currentSale || this.paymentForm.invalid) return;

    const originalAmount = Number(this.paymentForm.value.amount);
    const sourceCurrency = this.paymentForm.value.currency as Currency;
    const description = (this.paymentForm.value.description ?? "").trim();
    const exchangeRate = this.effectiveExchangeRate();
    const convertedAmount =
      sourceCurrency === this.currency()
        ? originalAmount
        : originalAmount * exchangeRate;

    const payment: SalePaymentRequest = {
      customerId: currentSale.customerId,
      originalAmount,
      sourceCurrency,
      description,
      exchangeRate,
      convertedAmount,
    };

    this.salesSvc.addPayment(currentSale.id, payment).subscribe({
      next: (createdPayment) => {
        const normalized = this.normalizePayment(createdPayment, payment, currentSale.customerId);
        this.payments.update((list) => [normalized, ...list]);
        this.paymentForm.reset({
          amount: 0,
          currency: this.currency(),
          description: "",
          exchangeRate: 0,
        });
        this.showAddPayment.set(false);

        if (currentSale.status !== "CONFIRMED") {
          this.salesSvc.update(currentSale.id, { status: "CONFIRMED" }).subscribe({
            next: (updated) => this.sale.set(updated),
            error: (err) => console.error("Error updating sale status:", err),
          });
        }
      },
      error: (err) => console.error("Error adding payment:", err),
    });
  }

  removePayment(id: string) {
    const currentSale = this.sale();
    if (!currentSale) return;

    this.salesSvc.deletePayment(currentSale.id, id).subscribe({
      next: () => this.payments.update((list) => list.filter((p) => p.id !== id)),
      error: (err) => console.error("Error deleting payment:", err),
    });
  }

  openAddPayment() {
    const saleCurrency = this.currency();
    this.showAddPayment.set(true);
    this.paymentForm.reset({
      amount: 0,
      currency: saleCurrency,
      description: "",
      exchangeRate: 0,
    });
  }

  onPaymentCurrencyChange() {
    const saleCurrency = this.currency();
    const paymentCurrency = this.paymentForm.value.currency as Currency;
    if (!paymentCurrency || paymentCurrency === saleCurrency) {
      this.paymentForm.patchValue({ exchangeRate: 0 });
      return;
    }

    this.paymentForm.patchValue({
      exchangeRate: this.defaultExchangeRate(paymentCurrency, saleCurrency),
    });
  }

  private defaultExchangeRate(from: Currency, to: Currency): number {
    if (from === to) return 1;

    const usdToEur = this.xr.rate();
    if (from === "USD" && to === "EUR") return usdToEur;
    if (from === "EUR" && to === "USD") return 1 / usdToEur;

    return 1;
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

  private loadPayments(saleId: string) {
    this.salesSvc.getPayments(saleId).subscribe({
      next: (payments) => {
        const customerId = this.sale()?.customerId ?? "";
        const normalized = payments.map((p) => this.normalizePayment(p, undefined, customerId));
        this.payments.set(normalized);
      },
      error: (err) => {
        if (err?.status !== 405) {
          console.error("Error loading payments:", err);
        }
        this.payments.set([]);
      },
    });
  }

  private normalizePayment(
    payment: Partial<SalePaymentResponse>,
    fallback?: SalePaymentRequest,
    fallbackCustomerId?: string,
  ): PaymentItem {
    const sourceCurrency =
      payment.sourceCurrency ??
      fallback?.sourceCurrency ??
      this.currency();

    const originalAmount = Number(
      payment.originalAmount ?? fallback?.originalAmount ?? 0,
    );

    const convertedAmount = Number(
      payment.convertedAmount ??
        fallback?.convertedAmount ??
        (sourceCurrency === this.currency()
          ? originalAmount
          : originalAmount * Number(payment.exchangeRate ?? fallback?.exchangeRate ?? 1)),
    );

    return {
      id: payment.id ?? crypto.randomUUID(),
      customerId: payment.customerId ?? fallback?.customerId ?? fallbackCustomerId ?? "",
      originalAmount,
      sourceCurrency,
      description: (payment.description ?? fallback?.description ?? "Pago").trim(),
      exchangeRate: Number(payment.exchangeRate ?? fallback?.exchangeRate ?? 1),
      convertedAmount,
      createdAt: payment.createdAt ?? new Date().toISOString(),
    };
  }
}
