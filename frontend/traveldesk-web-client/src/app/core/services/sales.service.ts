import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  Sale,
  CreateSaleDto,
  UpdateSaleTotalDto,
  ServiceBooking,
  CreateServiceDto,
  SaleFilters,
  Currency,
} from "../models";

@Injectable({ providedIn: "root" })
export class SalesService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/sales`;

  // ── Local state ───────────────────────────────────────────────────────────
  readonly sales = signal<Sale[]>([]);
  readonly loading = signal(false);
  readonly filters = signal<SaleFilters>({
    search: "",
    status: "",
    agentId: "",
    clientId: "",
    dateFrom: "",
    dateTo: "",
  });

  readonly filtered = computed(() => {
    const f = this.filters();
    return this.sales().filter((s) => {
      const matchSearch = !f.search || String(s.id).includes(f.search);
      const matchStatus = !f.status || s.status === f.status;
      const matchAgent = !f.agentId || s.agentId === f.agentId;
      const matchClient = !f.clientId || String(s.clientId) === f.clientId;
      const matchDate = !f.dateFrom || s.travelDate >= f.dateFrom;
      return (
        matchSearch && matchStatus && matchAgent && matchClient && matchDate
      );
    });
  });

  // ── API calls ─────────────────────────────────────────────────────────────
  loadAll() {
    this.loading.set(true);
    return this.http.get<Sale[]>(this.api).pipe(
      tap((data) => {
        this.sales.set(data);
        this.loading.set(false);
      }),
    );
  }

  getById(id: number) {
    return this.http.get<Sale>(`${this.api}/${id}`);
  }

  create(dto: CreateSaleDto) {
    return this.http
      .post<Sale>(this.api, dto)
      .pipe(tap((sale) => this.sales.update((list) => [sale, ...list])));
  }

  updateStatus(id: number, status: Sale["status"]) {
    return this.http
      .patch<Sale>(`${this.api}/${id}/status`, { status })
      .pipe(tap((updated) => this.updateLocal(updated)));
  }

  updateTotal(id: number, dto: UpdateSaleTotalDto) {
    return this.http
      .patch<Sale>(`${this.api}/${id}/total`, dto)
      .pipe(tap((updated) => this.updateLocal(updated)));
  }

  // ── Services (Bookings) ───────────────────────────────────────────────────
  addService(saleId: number, dto: CreateServiceDto) {
    return this.http
      .post<Sale>(`${this.api}/${saleId}/services`, dto)
      .pipe(tap((updated) => this.updateLocal(updated)));
  }

  removeService(saleId: number, serviceId: number) {
    return this.http
      .delete<Sale>(`${this.api}/${saleId}/services/${serviceId}`)
      .pipe(tap((updated) => this.updateLocal(updated)));
  }

  updateServicePayStatus(
    saleId: number,
    serviceId: number,
    payStatus: ServiceBooking["payStatus"],
  ) {
    return this.http
      .patch<Sale>(`${this.api}/${saleId}/services/${serviceId}/pay-status`, {
        payStatus,
      })
      .pipe(tap((updated) => this.updateLocal(updated)));
  }

  // ── Utilities ─────────────────────────────────────────────────────────────
  setFilter<K extends keyof SaleFilters>(key: K, value: SaleFilters[K]) {
    this.filters.update((f) => ({ ...f, [key]: value }));
  }

  clearFilters() {
    this.filters.set({
      search: "",
      status: "",
      agentId: "",
      clientId: "",
      dateFrom: "",
      dateTo: "",
    });
  }

  private updateLocal(updated: Sale) {
    this.sales.update((list) =>
      list.map((s) => (s.id === updated.id ? updated : s)),
    );
  }

  // ── Currency helpers (used also in templates via service) ─────────────────
  convert(amount: number, from: Currency, to: Currency, rate: number): number {
    if (from === to) return amount;
    return from === "USD" ? amount / rate : amount * rate;
  }

  calcNetTotal(sale: Sale, rate: number): number {
    return sale.services.reduce(
      (acc, s) =>
        acc + this.convert(s.netCost, s.currency, sale.saleCurrency, rate),
      0,
    );
  }

  calcProfit(sale: Sale, rate: number): number {
    return sale.saleTotal - this.calcNetTotal(sale, rate);
  }

  calcMargin(sale: Sale, rate: number): number {
    if (!sale.saleTotal) return 0;
    return (this.calcProfit(sale, rate) / sale.saleTotal) * 100;
  }
}
