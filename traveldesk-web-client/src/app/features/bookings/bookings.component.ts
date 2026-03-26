import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { BookingsService } from "../../core/services/bookings.service";
import { ClientsService } from "../../core/services/clients.service";
import { SuppliersService } from "../../core/services/suppliers.service";
import { SalesService } from "../../core/services/sales.service";
import {
  BookingFilters,
  BookingRequest,
  BookingResponse,
  Currency,
  SupplierRequest,
} from "../../core/models/models";
import { ExchangeRateService } from "../../core/services/exchange-rate.service";
import { Router } from "@angular/router";
import {
  getBookingAmount,
  getBookingCurrency,
  getBookingDateIn,
  getBookingDateOut,
  getBookingDescription,
  getBookingProvider,
  getBookingReservationCode,
} from "../../core/models/domain-helpers";
import { finalize, map, Observable, of } from "rxjs";
import { ClearZeroOnFocusDirective } from "../../shared/directives/clear-zero-on-focus.directive";

interface SupplierOption {
  id: string;
  name: string;
}

@Component({
  selector: "app-bookings",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ClearZeroOnFocusDirective],
  templateUrl: "./bookings.component.html",
})
export class BookingsComponent implements OnInit {
  private readonly pendingSupplierId = "__pending_new_supplier__";
  private readonly fb = inject(FormBuilder);

  readonly bookingsSvc = inject(BookingsService);
  readonly clientsSvc = inject(ClientsService);
  readonly suppliersSvc = inject(SuppliersService);
  readonly salesSvc = inject(SalesService);
  readonly xr = inject(ExchangeRateService);
  private readonly router = inject(Router);

  readonly showBookingEdit = signal(false);
  readonly editingBookingId = signal<string | null>(null);
  readonly savingBooking = signal(false);
  readonly bookingError = signal("");
  readonly pageError = signal("");
  readonly registerPayment = signal(false);
  readonly supplierSearch = signal("");
  readonly pendingNewSupplierName = signal("");
  readonly selectedSupplierId = signal("");

  readonly bookingForm = this.fb.group({
    supplierId: [""],
    provider: [""],
    providerCurrency: ["USD" as Currency],
    description: ["", Validators.required],
    reservationCode: ["", Validators.required],
    dateIn: ["", Validators.required],
    dateOut: [""],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    currency: ["USD" as Currency, Validators.required],
    customExchangeRate: [null as number | null],
    paymentDate: [""],
  });

  readonly filters = signal<BookingFilters>({
    search: "",
    status: "",
    supplierId: "",
    customerId: "",
  });

  readonly filteredBookings = computed(() => {
    const filters = this.filters();
    const bookings = this.bookingsSvc.bookings();

    return bookings.filter((booking) => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !getBookingReservationCode(booking).toLowerCase().includes(search) &&
          !getBookingDescription(booking).toLowerCase().includes(search)
        ) {
          return false;
        }
      }

      if (filters.status && booking.status !== filters.status) {
        return false;
      }

      if (filters.supplierId && booking.supplierId !== filters.supplierId) {
        return false;
      }

      if (filters.customerId && booking.customerId !== filters.customerId) {
        return false;
      }

      return true;
    });
  });

  readonly editingBooking = computed(() => {
    const bookingId = this.editingBookingId();
    if (!bookingId) return null;
    return this.bookingsSvc.bookings().find((booking) => booking.id === bookingId) ?? null;
  });

  readonly selectedSupplier = computed(() => {
    const supplierId = this.selectedSupplierId();
    if (!supplierId || supplierId === this.pendingSupplierId) return null;

    return this.suppliersSvc.suppliers().find((supplier) => supplier.id === supplierId) ?? null;
  });

  readonly isNewSupplierSelected = computed(
    () => this.selectedSupplierId() === this.pendingSupplierId,
  );

  readonly filteredSuppliers = computed(() => {
    const term = this.supplierSearch().trim().toLowerCase();
    if (!term) return this.suppliersSvc.suppliers();

    return this.suppliersSvc
      .suppliers()
      .filter((supplier) => supplier.name.toLowerCase().includes(term));
  });

  readonly supplierOptions = computed<SupplierOption[]>(() => {
    const options = this.filteredSuppliers().map((supplier) => ({
      id: supplier.id,
      name: supplier.name,
    }));

    const pendingName = this.pendingNewSupplierName().trim();
    if (!pendingName) return options;

    return [{ id: this.pendingSupplierId, name: `${pendingName} (nuevo)` }, ...options];
  });

  constructor() {}

  ngOnInit() {
    this.bookingsSvc.loadAll().subscribe();
    this.clientsSvc.loadAll().subscribe();
    this.suppliersSvc.loadAll().subscribe();
    this.salesSvc.loadAll().subscribe();
    this.xr.loadRate().subscribe();
  }

  setFilter<K extends keyof BookingFilters>(key: K, value: BookingFilters[K]) {
    this.filters.update((f) => ({ ...f, [key]: value }));
  }

  getVal(event: Event): string {
    return (event.target as HTMLSelectElement | HTMLInputElement).value;
  }

  openBookingDetails(booking: BookingResponse) {
    this.bookingError.set("");
    this.editingBookingId.set(booking.id);
    this.registerPayment.set(booking.status === "PAID");
    this.showBookingEdit.set(true);

    const supplier = booking.supplierId
      ? this.suppliersSvc.suppliers().find((s) => s.id === booking.supplierId)
      : null;

    this.bookingForm.patchValue({
      supplierId: booking.supplierId ?? "",
      provider: getBookingProvider(booking),
      providerCurrency: supplier?.currency ?? getBookingCurrency(booking),
      description: getBookingDescription(booking),
      reservationCode: getBookingReservationCode(booking),
      dateIn: getBookingDateIn(booking),
      dateOut: getBookingDateOut(booking),
      amount: getBookingAmount(booking),
      currency: getBookingCurrency(booking),
      customExchangeRate: booking.exchangeRate ?? null,
      paymentDate: booking.paymentDate ?? this.todayIso(),
    });

    this.selectedSupplierId.set(booking.supplierId ?? "");
    this.bookingForm.controls.currency.enable({ emitEvent: false });

    if (supplier) {
      this.supplierSearch.set(supplier.name);
      this.pendingNewSupplierName.set("");
      return;
    }

    const providerName = getBookingProvider(booking).trim();
    if (providerName) {
      this.supplierSearch.set(providerName);
      this.pendingNewSupplierName.set(providerName);
      this.bookingForm.patchValue({ supplierId: this.pendingSupplierId });
      return;
    }

    this.supplierSearch.set("");
    this.pendingNewSupplierName.set("");
  }

  closeBookingModal() {
    this.bookingError.set("");
    this.showBookingEdit.set(false);
    this.editingBookingId.set(null);
  }

  goToRelatedSale(booking: BookingResponse) {
    const saleId = this.findRelatedSaleId(booking);
    if (!saleId) {
      this.pageError.set("No se encontró una venta relacionada para esta reserva");
      return;
    }

    this.pageError.set("");

    this.router.navigate(["/app/sales", saleId]);
  }

  saveBooking() {
    this.bookingError.set("");
    const currentBooking = this.editingBooking();
    if (!currentBooking || this.savingBooking()) return;

    const supplierId = this.bookingForm.value.supplierId ?? "";
    if (!supplierId) {
      this.bookingError.set("Debe seleccionar un proveedor");
      return;
    }

    if (this.isNewSupplierSelected()) {
      const supplierName = this.pendingNewSupplierName().trim();
      if (!supplierName) {
        this.bookingError.set("Debe ingresar el nombre del proveedor nuevo");
        return;
      }
    }

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.savingBooking.set(true);

    this.resolveSupplierId().subscribe({
      next: (resolvedSupplierId) => {
        const value = this.bookingForm.getRawValue();
        const bookingCurrency = this.effectiveBookingCurrency();
        const providerCurrency =
          (value.providerCurrency as Currency) ?? bookingCurrency;
        const bookingOriginalAmount = Number(value.amount);
        const bookingRate = this.requiresBookingCustomRate()
          ? Number(
              value.customExchangeRate ??
                this.defaultExchangeRate(bookingCurrency, providerCurrency),
            )
          : 1;

        const dto: BookingRequest = {
          customerId: currentBooking.customerId ?? "",
          supplierId: resolvedSupplierId,
          reference: value.reservationCode ?? "",
          destination: value.description ?? "",
          departureDate: value.dateIn ?? "",
          returnDate: value.dateOut || undefined,
          amount: bookingOriginalAmount,
          currency: bookingCurrency,
          originalAmount: bookingOriginalAmount,
          sourceCurrency: bookingCurrency,
          exchangeRate: bookingRate,
          convertedAmount: bookingOriginalAmount * bookingRate,
          paymentDate: this.registerPayment()
            ? value.paymentDate || this.todayIso()
            : undefined,
          passengerName: currentBooking.customerName ?? "Sin pasajero",
          status: this.registerPayment() ? "PAID" : currentBooking.status,
        };

        this.bookingsSvc
          .update(currentBooking.id, dto)
          .pipe(finalize(() => this.savingBooking.set(false)))
          .subscribe({
            next: () => this.closeBookingModal(),
            error: (err) => {
              this.bookingError.set(
                this.extractBackendMessage(
                  err,
                  "No se pudo guardar el booking. Verifica los datos e intenta nuevamente.",
                ),
              );
              console.error("Error saving booking:", err);
            },
          });
      },
      error: (err) => {
        this.savingBooking.set(false);
        this.bookingError.set(
          this.extractBackendMessage(
            err,
            "No se pudo validar el proveedor para guardar el booking.",
          ),
        );
        console.error("Error resolving supplier:", err);
      },
    });
  }

  private extractBackendMessage(error: unknown, fallbackMessage: string): string {
    if (!error || typeof error !== "object") return fallbackMessage;

    const response = error as {
      error?: { message?: string } | string;
      message?: string;
    };

    if (typeof response.error === "string" && response.error.trim()) {
      return this.normalizeBookingReferenceConflict(response.error);
    }

    if (
      response.error &&
      typeof response.error === "object" &&
      typeof response.error.message === "string" &&
      response.error.message.trim()
    ) {
      return this.normalizeBookingReferenceConflict(response.error.message);
    }

    if (typeof response.message === "string" && response.message.trim()) {
      return this.normalizeBookingReferenceConflict(response.message);
    }

    return fallbackMessage;
  }

  private normalizeBookingReferenceConflict(message: string): string {
    const conflictPattern = /Booking reference\s+(.+?)\s+is already in use/i;
    const match = conflictPattern.exec(message);
    if (!match) return message;

    const bookingReference = match[1]?.trim();
    if (!bookingReference) return "Ya existe una reserva con codigo de referencia";

    return `Ya existe una reserva con codigo de referencia ${bookingReference}`;
  }

  onSupplierSelectionChange() {
    this.selectedSupplierId.set(this.bookingForm.getRawValue().supplierId ?? "");

    if (this.isNewSupplierSelected()) {
      this.pendingNewSupplierName.set(this.supplierSearch().trim());
      this.bookingForm.patchValue({
        providerCurrency: "USD" as Currency,
        currency: "USD" as Currency,
        customExchangeRate: null,
      });
      this.bookingForm.controls.currency.enable({ emitEvent: false });
      return;
    }

    const supplier = this.selectedSupplier();
    if (supplier) {
      this.pendingNewSupplierName.set("");
      this.bookingForm.patchValue({
        providerCurrency: supplier.currency,
        currency: supplier.currency,
      });
      this.bookingForm.controls.currency.enable({ emitEvent: false });
      this.onBookingCurrencyChange();
      return;
    }

    this.bookingForm.patchValue({
      providerCurrency: "USD" as Currency,
      currency: "USD" as Currency,
      customExchangeRate: null,
    });
    this.bookingForm.controls.currency.enable({ emitEvent: false });
  }

  onProviderCurrencyChange() {
    if (!this.isNewSupplierSelected()) return;

    const providerCurrency = this.bookingForm.value.providerCurrency as Currency;
    this.bookingForm.patchValue({ currency: providerCurrency });
    this.onBookingCurrencyChange();
  }

  onSupplierSearchInput(event: Event) {
    const typedValue = this.getVal(event);
    const typedName = typedValue.trim();

    this.supplierSearch.set(typedValue);

    if (!typedName) {
      this.pendingNewSupplierName.set("");
      this.bookingForm.patchValue({ supplierId: "" });
      this.onSupplierSelectionChange();
      return;
    }

    const exactMatch = this.suppliersSvc
      .suppliers()
      .find(
        (supplier) => supplier.name.trim().toLowerCase() === typedName.toLowerCase(),
      );

    if (exactMatch) {
      this.pendingNewSupplierName.set("");
      this.bookingForm.patchValue({ supplierId: exactMatch.id });
      this.onSupplierSelectionChange();
      return;
    }

    const firstMatch = this.filteredSuppliers()[0];
    if (firstMatch) {
      this.pendingNewSupplierName.set("");
      this.bookingForm.patchValue({ supplierId: firstMatch.id });
      this.onSupplierSelectionChange();
      return;
    }

    this.pendingNewSupplierName.set(typedName);
    this.bookingForm.patchValue({ supplierId: this.pendingSupplierId });
    this.onSupplierSelectionChange();
  }

  toggleRegisterPayment() {
    this.registerPayment.set(!this.registerPayment());
    if (this.registerPayment() && !this.bookingForm.value.paymentDate) {
      this.bookingForm.patchValue({ paymentDate: this.todayIso() });
    }
  }

  onBookingCurrencyChange() {
    if (this.isNewSupplierSelected()) {
      const bookingCurrency = this.bookingForm.getRawValue().currency as Currency;
      this.bookingForm.patchValue({ providerCurrency: bookingCurrency });
    }

    if (!this.requiresBookingCustomRate()) {
      this.bookingForm.patchValue({ customExchangeRate: null });
      return;
    }

    const bookingCurrency = this.effectiveBookingCurrency();
    this.bookingForm.patchValue({
      customExchangeRate: this.defaultExchangeRate(bookingCurrency, bookingCurrency),
    });
  }

  requiresBookingCustomRate(): boolean {
    const providerCurrency = this.bookingForm.getRawValue().providerCurrency as Currency;
    const bookingCurrency = this.effectiveBookingCurrency();
    return !!bookingCurrency && !!providerCurrency && bookingCurrency !== providerCurrency;
  }

  bookingRatePlaceholder(): string {
    const bookingCurrency = this.effectiveBookingCurrency();
    const providerCurrency = this.bookingForm.getRawValue().providerCurrency as Currency;
    if (!bookingCurrency || !providerCurrency) return "";
    return this.defaultExchangeRate(bookingCurrency, providerCurrency).toFixed(4);
  }

  getBookingDescription = getBookingDescription;
  getBookingProvider = getBookingProvider;
  getBookingReservationCode = getBookingReservationCode;
  getBookingDateIn = getBookingDateIn;
  getBookingDateOut = getBookingDateOut;

  private resolveSupplierId(): Observable<string> {
    const supplierId = this.bookingForm.value.supplierId ?? "";
    if (supplierId && supplierId !== this.pendingSupplierId) {
      return of(supplierId);
    }

    const providerName = this.pendingNewSupplierName().trim();
    const existing = this.suppliersSvc
      .suppliers()
      .find((supplier) => supplier.name.toLowerCase() === providerName.toLowerCase());

    if (existing) {
      return of(existing.id);
    }

    const providerCurrency =
      (this.bookingForm.getRawValue().providerCurrency as Currency) ?? "USD";

    const createSupplierDto: SupplierRequest = {
      name: providerName,
      serviceType: "OTHER",
      currency: providerCurrency,
    };

    return this.suppliersSvc
      .create(createSupplierDto)
      .pipe(map((supplier) => supplier.id));
  }

  private defaultExchangeRate(from: Currency, to: Currency): number {
    if (from === to) return 1;
    return this.xr.getRateForPair(from, to);
  }

  private todayIso() {
    return new Date().toISOString().slice(0, 10);
  }

  private effectiveBookingCurrency(): Currency {
    return (this.bookingForm.getRawValue().currency as Currency) || "USD";
  }

  private findRelatedSaleId(booking: BookingResponse): string | null {
    const sales = this.salesSvc.sales();
    if (!sales.length) return null;

    const bookingCustomerId = booking.customerId ?? "";
    const bookingDestination = getBookingDescription(booking).trim().toLowerCase();

    const sameCustomer = sales.filter((sale) => {
      const saleCustomerId = sale.clientId ?? sale.customerId ?? "";
      return !!bookingCustomerId && saleCustomerId === bookingCustomerId;
    });

    if (!sameCustomer.length) return null;

    const exactDestination = sameCustomer.find(
      (sale) => (sale.destination ?? "").trim().toLowerCase() === bookingDestination,
    );
    if (exactDestination) return exactDestination.id;

    const sortedByDate = [...sameCustomer].sort((a, b) => {
      const dateA = new Date(a.travelDate ?? a.departureDate ?? 0).getTime();
      const dateB = new Date(b.travelDate ?? b.departureDate ?? 0).getTime();
      return dateB - dateA;
    });

    return sortedByDate[0]?.id ?? null;
  }
}
