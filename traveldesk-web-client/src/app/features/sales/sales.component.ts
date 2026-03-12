import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { SalesService } from "../../core/services/sales.service";
import { ClientsService } from "../../core/services/clients.service";
import { SuppliersService } from "../../core/services/suppliers.service";
import { BookingsService } from "../../core/services/bookings.service";
import { TeamService } from "../../core/services/team.service";
import { ExchangeRateService } from "../../core/services/exchange-rate.service";
import { AuthService } from "../../core/services/auth.service";
import { SaleRequest, BookingRequest } from "../../core/models";

interface CustomerOption {
  id: string;
  fullName: string;
}

@Component({
  selector: "app-sales",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./sales.component.html",
})
export class SalesComponent implements OnInit {
  private readonly pendingCustomerId = "__pending_new_customer__";

  salesSvc = inject(SalesService);
  clientsSvc = inject(ClientsService);
  suppliersSvc = inject(SuppliersService);
  bookingsSvc = inject(BookingsService);
  teamSvc = inject(TeamService);
  xr = inject(ExchangeRateService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  isAdmin = this.auth.isLoggedIn;

  showNewSale = signal(false);
  showAddService = signal<string | null>(null);
  showQuickNewClient = signal(false);
  manualRateInput = signal("");
  customerSearch = signal("");
  pendingNewCustomerName = signal("");

  saleStatuses: string[] = ["CREATED", "CONFIRMED", "CANCELLED"];

  saleForm = this.fb.group({
    customerId: ["", Validators.required],
    destination: ["", Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    currency: ["USD", Validators.required],
  });

  bookingForm = this.fb.group({
    customerId: ["", Validators.required],
    supplierId: ["", Validators.required],
    reference: ["", Validators.required],
    passengerName: ["", Validators.required],
    destination: ["", Validators.required],
    departureDate: ["", Validators.required],
    returnDate: [""],
    status: ["PENDING", Validators.required],
  });

  quickClientForm = this.fb.group({
    fullName: ["", Validators.required],
  });

  filteredCustomers = computed(() => {
    const term = this.customerSearch().trim().toLowerCase();
    if (!term) return this.clientsSvc.clients();

    return this.clientsSvc
      .clients()
      .filter((c) => c.fullName.toLowerCase().includes(term));
  });

  customerOptions = computed<CustomerOption[]>(() => {
    const options = this.filteredCustomers().map((c) => ({
      id: c.id,
      fullName: c.fullName,
    }));

    const pendingName = this.pendingNewCustomerName().trim();
    if (!pendingName) return options;

    return [{ id: this.pendingCustomerId, fullName: `${pendingName} (nuevo)` }, ...options];
  });

  ngOnInit() {
    this.salesSvc.loadAll().subscribe();
    this.clientsSvc.loadAll().subscribe({
      next: () => this.ensureCustomerSelected(),
    });
    this.suppliersSvc.loadAll().subscribe();
    this.teamSvc.loadAll().subscribe();
  }

  openNewSaleModal() {
    this.showNewSale.set(true);
    this.ensureCustomerSelected();
  }

  openAddService(saleId: string) {
    this.showAddService.set(saleId);
    this.bookingForm.reset({ status: "PENDING" });
  }

  openSaleDetails(saleId: string) {
    this.router.navigate(["/app/sales", saleId]);
  }

  createSale() {
    if (this.saleForm.invalid) return;

    const v = this.saleForm.value;

    const dto: SaleRequest = {
      ...(v.customerId === this.pendingCustomerId
        ? { customerName: this.pendingNewCustomerName().trim() }
        : { customerId: v.customerId! }),
      destination: v.destination!,
      amount: Number(v.amount),
      currency: v.currency! as "USD" | "EUR",
      status: "CREATED",
    };

    this.salesSvc.create(dto).subscribe({
        next: (sale) => {
          this.showNewSale.set(false);
          this.saleForm.reset({ currency: "USD" });
          this.customerSearch.set("");
          this.pendingNewCustomerName.set("");
          this.showQuickNewClient.set(false);
          this.quickClientForm.reset();
          this.router.navigate(["/app/sales", sale.id]);
        },
        error: (err) => console.error("Error creating sale:", err),
      });
  }

  createQuickClient() {
    if (this.quickClientForm.invalid) {
      this.quickClientForm.markAllAsTouched();
      return;
    }

    const name = this.quickClientForm.value.fullName?.trim();
    if (!name) return;

    this.pendingNewCustomerName.set(name);
    this.saleForm.patchValue({ customerId: this.pendingCustomerId });
    this.customerSearch.set(name);
    this.showQuickNewClient.set(false);
    this.quickClientForm.reset();
  }

  onCustomerSearchInput(event: Event) {
    this.customerSearch.set(this.getVal(event));
    this.pendingNewCustomerName.set("");

    const firstMatch = this.filteredCustomers()[0];
    this.saleForm.patchValue({ customerId: firstMatch?.id ?? "" });
  }

  private ensureCustomerSelected() {
    const currentCustomerId = this.saleForm.value.customerId;
    if (currentCustomerId) return;

    const firstOption = this.customerOptions()[0];
    if (firstOption) {
      this.saleForm.patchValue({ customerId: firstOption.id });
    }
  }

  addService() {
    if (this.bookingForm.invalid) return;

    const v = this.bookingForm.value;
    const dto: BookingRequest = {
      customerId: v.customerId!,
      supplierId: v.supplierId!,
      reference: v.reference!,
      passengerName: v.passengerName!,
      destination: v.destination!,
      departureDate: v.departureDate!,
      returnDate: v.returnDate || undefined,
      status: v.status!,
    };

    this.bookingsSvc.create(dto).subscribe({
      next: () => {
        this.showAddService.set(null);
        this.bookingForm.reset({ status: "PENDING" });
      },
      error: (err) => console.error("Error creating booking:", err),
    });
  }

  onManualRateChange(event: Event) {
    const val = Number.parseFloat((event.target as HTMLInputElement).value);
    this.manualRateInput.set((event.target as HTMLInputElement).value);
    this.xr.setManualRate(Number.isNaN(val) ? null : val);
  }

  getVal(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  getClientName(id: string): string {
    return this.clientsSvc.getById(id)?.fullName ?? "—";
  }

  getClientInitial(id: string): string {
    return (this.clientsSvc.getById(id)?.fullName ?? "?")[0].toUpperCase();
  }

  getSupplierName(id: string): string {
    return this.suppliersSvc.suppliers().find((p) => p.id === id)?.name ?? "—";
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      CREATED: "bg-amber-500/10 text-amber-500",
      CONFIRMED: "bg-emerald-500/10 text-emerald-500",
      CANCELLED: "bg-red-500/10 text-red-500",
    };
    return map[status] ?? "";
  }

  statusDot(status: string): string {
    const map: Record<string, string> = {
      CREATED: "bg-amber-500",
      CONFIRMED: "bg-emerald-500",
      CANCELLED: "bg-red-500",
    };
    return map[status] ?? "";
  }
}
