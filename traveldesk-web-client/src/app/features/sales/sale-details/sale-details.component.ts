import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { map, Observable, of } from "rxjs";
import {
  BookingRequest,
  BookingResponse,
  Currency,
  PaymentReceivedRequest,
  PaymentReceivedResponse,
  SaleRequest,
  SaleResponse,
  SupplierRequest,
} from "../../../core/models";
import {
  getBookingAmount,
  getBookingAmountInSaleCurrency,
  getBookingCurrency,
  getBookingDateIn,
  getBookingDateOut,
  getBookingDescription,
  getBookingProvider,
  getBookingReservationCode,
  getPaymentReceivedAmount,
  getSaleClientName,
  getSaleCurrency,
  getSaleTotalAmount,
  getSaleTravelDate,
} from "../../../core/models/domain-helpers";
import { BookingsService } from "../../../core/services/bookings.service";
import { ExchangeRateService } from "../../../core/services/exchange-rate.service";
import { SalesService } from "../../../core/services/sales.service";
import { SuppliersService } from "../../../core/services/suppliers.service";

type PaymentItem = PaymentReceivedResponse;

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
  readonly showSaleEdit = signal(false);
  readonly showAddBooking = signal(false);
  readonly showAddPayment = signal(false);
  readonly editingBookingId = signal<string | null>(null);
  readonly useCustomProvider = signal(false);
  readonly registerPayment = signal(false);
  readonly payments = signal<PaymentItem[]>([]);

  readonly saleForm = this.fb.group({
    destination: ["", Validators.required],
    travelDate: ["", Validators.required],
  });

  readonly paymentForm = this.fb.group({
    date: [this.todayIso(), Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    currency: ["USD", Validators.required],
    description: ["", [Validators.required, Validators.pattern(/.*\S.*/)]],
    customExchangeRate: [null as number | null],
  });

  readonly bookingForm = this.fb.group({
    supplierId: [""],
    provider: [""],
    providerCurrency: ["USD", Validators.required],
    description: ["", Validators.required],
    reservationCode: ["", Validators.required],
    dateIn: ["", Validators.required],
    dateOut: [""],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    currency: ["USD", Validators.required],
    customExchangeRate: [null as number | null],
    paymentDate: [""],
  });

  readonly currency = computed<Currency>(() =>
    getSaleCurrency(this.sale() ?? {}),
  );

  readonly selectedSupplier = computed(() => {
    const supplierId = this.bookingForm.value.supplierId;
    if (!supplierId) return null;
    return (
      this.suppliersSvc.suppliers().find((s) => s.id === supplierId) ?? null
    );
  });

  readonly isSupplierLocked = computed(() => this.selectedSupplier() !== null);

  readonly saleBookings = computed(() => {
    const currentSale = this.sale();
    if (!currentSale) return [] as BookingResponse[];

    return this.bookingsSvc.bookings().filter((booking) => {
      const saleClientId = currentSale.clientId ?? currentSale.customerId;
      return !!saleClientId && booking.customerId === saleClientId;
    });
  });

  readonly paymentsReceived = computed(() =>
    this.payments().reduce(
      (accumulator, payment) =>
        accumulator + getPaymentReceivedAmount(payment, this.currency()),
      0,
    ),
  );

  readonly totalPaidBookings = computed(() =>
    this.saleBookings()
      .filter((booking) => booking.status === "PAID")
      .reduce(
        (accumulator, booking) =>
          accumulator +
          getBookingAmountInSaleCurrency(booking, this.currency()),
        0,
      ),
  );

  readonly pendingBalance = computed(
    () => getSaleTotalAmount(this.sale() ?? {}) - this.paymentsReceived(),
  );

  readonly feeAmount = computed(
    () => this.paymentsReceived() - this.totalPaidBookings(),
  );

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
        this.saleForm.patchValue({
          destination: sale.destination,
          travelDate: getSaleTravelDate(sale),
        });
        this.paymentForm.patchValue({ currency: getSaleCurrency(sale) });
        this.loadPayments(sale.id);
        this.bookingsSvc.loadAll().subscribe();
        this.suppliersSvc.loadAll().subscribe();
        this.xr.loadRate().subscribe();
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

  updateSaleDetails() {
    const currentSale = this.sale();
    if (!currentSale || this.saleForm.invalid) return;

    const dto: Partial<SaleRequest> = {
      destination: this.saleForm.value.destination ?? currentSale.destination,
      departureDate:
        this.saleForm.value.travelDate ?? getSaleTravelDate(currentSale),
    };

    this.salesSvc.update(currentSale.id, dto).subscribe({
      next: (updated) => {
        this.sale.set(updated);
        this.showSaleEdit.set(false);
      },
      error: (err) => console.error("Error updating sale details:", err),
    });
  }

  openAddPayment() {
    this.showAddPayment.set(true);
    this.paymentForm.reset({
      date: this.todayIso(),
      amount: null,
      currency: this.currency(),
      description: "",
      customExchangeRate: null,
    });
  }

  addPayment() {
    const currentSale = this.sale();
    if (!currentSale || this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const currency = this.paymentForm.value.currency as Currency;
    const isDifferentCurrency = currency !== this.currency();
    const defaultRate = this.defaultExchangeRate(currency, this.currency());
    const exchangeRate = isDifferentCurrency
      ? Number(this.paymentForm.value.customExchangeRate ?? defaultRate)
      : 1;
    const originalAmount = Number(this.paymentForm.value.amount);
    const dto: PaymentReceivedRequest = {
      saleId: currentSale.id,
      date: this.paymentForm.value.date ?? this.todayIso(),
      amount: originalAmount,
      currency,
      customerId: currentSale.customerId ?? currentSale.clientId,
      originalAmount,
      sourceCurrency: currency,
      exchangeRate,
      convertedAmount: originalAmount * exchangeRate,
      description: (this.paymentForm.value.description ?? "").trim(),
      ...(isDifferentCurrency &&
      this.paymentForm.value.customExchangeRate != null
        ? { customExchangeRate: exchangeRate }
        : {}),
    };

    this.salesSvc.addPayment(currentSale.id, dto).subscribe({
      next: () => {
        this.loadPayments(currentSale.id);
        this.showAddPayment.set(false);
      },
      error: (err) => console.error("Error adding payment:", err),
    });
  }

  removePayment(id: string) {
    const currentSale = this.sale();
    if (!currentSale) return;

    this.salesSvc.deletePayment(currentSale.id, id).subscribe({
      next: () =>
        this.payments.update((list) =>
          list.filter((payment) => payment.id !== id),
        ),
      error: (err) => console.error("Error deleting payment:", err),
    });
  }

  openAddBooking() {
    this.editingBookingId.set(null);
    this.useCustomProvider.set(false);
    this.registerPayment.set(false);
    this.showAddBooking.set(true);
    const saleCurrency = this.currency();
    this.bookingForm.reset({
      supplierId: "",
      provider: "",
      providerCurrency: saleCurrency,
      description: this.sale()?.destination ?? "",
      reservationCode: "",
      dateIn: getSaleTravelDate(this.sale() ?? {}),
      dateOut: "",
      amount: 0,
      currency: saleCurrency,
      customExchangeRate: null,
      paymentDate: this.todayIso(),
    });
  }

  editBooking(booking: BookingResponse) {
    this.editingBookingId.set(booking.id);
    this.useCustomProvider.set(
      !booking.supplierId && !!getBookingProvider(booking),
    );
    this.registerPayment.set(booking.status === "PAID");
    this.showAddBooking.set(true);
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
  }

  saveBooking() {
    const currentSale = this.sale();
    if (!currentSale) return;

    // Validate provider-specific fields
    if (this.useCustomProvider()) {
      const providerName = (this.bookingForm.value.provider ?? "").trim();
      if (!providerName) {
        alert("El nombre del proveedor es requerido");
        return;
      }
    } else {
      const supplierId = this.bookingForm.value.supplierId ?? "";
      if (!supplierId) {
        alert("Debe seleccionar un proveedor");
        return;
      }
    }

    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched();
      return;
    }

    this.resolveSupplierId().subscribe({
      next: (supplierId) => {
        const value = this.bookingForm.value;
        const bookingCurrency = value.currency as Currency;
        const bookingOriginalAmount = Number(value.amount);
        const bookingRate = this.requiresBookingCustomRate()
          ? Number(
              value.customExchangeRate ??
                this.defaultExchangeRate(bookingCurrency, this.currency()),
            )
          : 1;
        const bookingConvertedAmount = bookingOriginalAmount * bookingRate;

        const dto: BookingRequest = {
          customerId: currentSale.clientId ?? currentSale.customerId,
          supplierId,
          reference: value.reservationCode ?? "",
          destination: value.description ?? "",
          departureDate: value.dateIn ?? "",
          returnDate: value.dateOut || undefined,
          amount: bookingOriginalAmount,
          currency: bookingCurrency,
          originalAmount: bookingOriginalAmount,
          sourceCurrency: bookingCurrency,
          exchangeRate: bookingRate,
          convertedAmount: bookingConvertedAmount,
          paymentDate: this.registerPayment()
            ? value.paymentDate || this.todayIso()
            : undefined,
          passengerName: getSaleClientName(currentSale),
          status: this.registerPayment() ? "PAID" : "CREATED",
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
      },
      error: (err) => console.error("Error resolving supplier:", err),
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

  onPaymentCurrencyChange() {
    if (!this.requiresCustomRate()) {
      this.paymentForm.patchValue({ customExchangeRate: null });
      return;
    }

    const paymentCurrency = this.paymentForm.value.currency as Currency;
    this.paymentForm.patchValue({
      customExchangeRate: this.defaultExchangeRate(
        paymentCurrency,
        this.currency(),
      ),
    });
  }

  requiresCustomRate(): boolean {
    const paymentCurrency = this.paymentForm.value.currency as Currency;
    return !!paymentCurrency && paymentCurrency !== this.currency();
  }

  requiresBookingCustomRate(): boolean {
    const bookingCurrency = this.bookingForm.value.currency as Currency;
    return !!bookingCurrency && bookingCurrency !== this.currency();
  }

  paymentRatePlaceholder(): string {
    const paymentCurrency = this.paymentForm.value.currency as Currency;
    if (!paymentCurrency) return "";
    return this.defaultExchangeRate(paymentCurrency, this.currency()).toFixed(
      4,
    );
  }

  bookingRatePlaceholder(): string {
    const bookingCurrency = this.bookingForm.value.currency as Currency;
    if (!bookingCurrency) return "";
    return this.defaultExchangeRate(bookingCurrency, this.currency()).toFixed(
      4,
    );
  }

  onBookingCurrencyChange() {
    if (!this.requiresBookingCustomRate()) {
      this.bookingForm.patchValue({ customExchangeRate: null });
      return;
    }

    const bookingCurrency = this.bookingForm.value.currency as Currency;
    this.bookingForm.patchValue({
      customExchangeRate: this.defaultExchangeRate(
        bookingCurrency,
        this.currency(),
      ),
    });
  }

  toggleRegisterPayment() {
    this.registerPayment.set(!this.registerPayment());
    if (this.registerPayment() && !this.bookingForm.value.paymentDate) {
      this.bookingForm.patchValue({ paymentDate: this.todayIso() });
    }
  }

  toggleProviderMode(useCustomProvider: boolean) {
    this.useCustomProvider.set(useCustomProvider);
    if (useCustomProvider) {
      const providerCurrency =
        (this.bookingForm.value.providerCurrency as Currency) ??
        this.currency();
      this.bookingForm.patchValue({
        supplierId: "",
        provider: "",
        currency: providerCurrency,
      });
      this.onBookingCurrencyChange();
    } else {
      this.bookingForm.patchValue({ provider: "" });
      // Auto-sync currency from selected supplier if available
      const supplier = this.selectedSupplier();
      if (supplier) {
        this.bookingForm.patchValue({ currency: supplier.currency });
        this.onBookingCurrencyChange();
      }
    }
  }

  onSupplierSelectionChange() {
    const supplier = this.selectedSupplier();
    if (supplier) {
      // Sync booking currency with supplier currency
      this.bookingForm.patchValue({ currency: supplier.currency });
      this.onBookingCurrencyChange();
    }
  }

  onProviderCurrencyChange() {
    if (!this.useCustomProvider()) return;
    const providerCurrency = this.bookingForm.value
      .providerCurrency as Currency;
    this.bookingForm.patchValue({ currency: providerCurrency });
    this.onBookingCurrencyChange();
  }
  formatMoney(amount: number, currency: string) {
    return `${currency} ${Number(amount ?? 0).toFixed(2)}`;
  }

  formatPaymentLine(payment: PaymentItem): string {
    const saleCurrency = this.currency();
    const sourceCurrency =
      payment.sourceCurrency ?? payment.currency ?? saleCurrency;
    const originalAmount = Number(
      payment.originalAmount ?? payment.amount ?? 0,
    );

    const convertedAmount = Number(
      payment.convertedAmount ??
        (sourceCurrency === saleCurrency
          ? originalAmount
          : originalAmount *
            Number(payment.exchangeRate ?? payment.customExchangeRate ?? 1)),
    );

    if (sourceCurrency !== saleCurrency) {
      return `${sourceCurrency} ${originalAmount.toFixed(2)} -> ${saleCurrency} ${convertedAmount.toFixed(2)}`;
    }

    return `${saleCurrency} ${convertedAmount.toFixed(2)}`;
  }

  formatBookingLine(booking: BookingResponse): string {
    const saleCurrency = this.currency();
    const sourceCurrency =
      booking.sourceCurrency ?? booking.currency ?? saleCurrency;
    const originalAmount = Number(
      booking.originalAmount ?? booking.amount ?? 0,
    );

    const convertedAmount = Number(
      booking.convertedAmount ??
        (sourceCurrency === saleCurrency
          ? originalAmount
          : originalAmount * Number(booking.exchangeRate ?? 1)),
    );

    if (sourceCurrency !== saleCurrency) {
      return `${sourceCurrency} ${originalAmount.toFixed(2)} -> ${saleCurrency} ${convertedAmount.toFixed(2)}`;
    }

    return `${saleCurrency} ${convertedAmount.toFixed(2)}`;
  }

  getSaleClientName = getSaleClientName;
  getSaleTravelDate = getSaleTravelDate;
  getSaleTotalAmount = getSaleTotalAmount;
  getBookingDescription = getBookingDescription;
  getBookingProvider = getBookingProvider;
  getBookingReservationCode = getBookingReservationCode;
  getBookingAmount = getBookingAmount;
  getBookingCurrency = getBookingCurrency;

  private loadPayments(saleId: string) {
    this.salesSvc.getPayments(saleId).subscribe({
      next: (payments) =>
        this.payments.set(
          payments.map((payment) => this.normalizePayment(payment)),
        ),
      error: (err) => {
        if (err?.status !== 405) {
          console.error("Error loading payments:", err);
        }
        this.payments.set([]);
      },
    });
  }

  private resolveSupplierId(): Observable<string> {
    const supplierId = this.bookingForm.value.supplierId ?? "";
    if (!this.useCustomProvider()) {
      return of(supplierId);
    }

    const providerName = (this.bookingForm.value.provider ?? "").trim();
    const existing = this.suppliersSvc
      .suppliers()
      .find(
        (supplier) =>
          supplier.name.toLowerCase() === providerName.toLowerCase(),
      );

    if (existing) {
      return of(existing.id);
    }

    const providerCurrency =
      (this.bookingForm.value.providerCurrency as Currency) ?? this.currency();
    const createSupplierDto: SupplierRequest = {
      name: providerName,
      serviceType: "OTHER",
      currency: providerCurrency,
    };

    return this.suppliersSvc
      .create(createSupplierDto)
      .pipe(map((supplier) => supplier.id));
  }

  private normalizePayment(
    payment: Partial<PaymentReceivedResponse>,
    fallback?: PaymentReceivedRequest,
  ): PaymentItem {
    return {
      id: payment.id ?? crypto.randomUUID(),
      saleId: payment.saleId ?? fallback?.saleId,
      date:
        payment.date ?? fallback?.date ?? payment.createdAt ?? this.todayIso(),
      amount: Number(
        payment.amount ??
          fallback?.amount ??
          payment.convertedAmount ??
          payment.originalAmount ??
          0,
      ),
      currency:
        payment.currency ??
        fallback?.currency ??
        payment.sourceCurrency ??
        this.currency(),
      description: (
        payment.description ??
        fallback?.description ??
        "Pago recibido"
      ).trim(),
      customExchangeRate:
        Number(
          payment.customExchangeRate ??
            fallback?.customExchangeRate ??
            payment.exchangeRate ??
            0,
        ) || undefined,
      createdAt:
        payment.createdAt ??
        payment.date ??
        fallback?.date ??
        new Date().toISOString(),
      originalAmount: payment.originalAmount,
      sourceCurrency: payment.sourceCurrency,
      exchangeRate: payment.exchangeRate,
      convertedAmount: payment.convertedAmount,
    };
  }

  private defaultExchangeRate(from: Currency, to: Currency): number {
    if (from === to) return 1;

    return this.xr.getRateForPair(from, to);
  }

  private todayIso() {
    return new Date().toISOString().slice(0, 10);
  }
}
