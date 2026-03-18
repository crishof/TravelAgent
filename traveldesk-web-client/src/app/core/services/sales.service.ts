import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  SaleResponse,
  SaleRequest,
  SaleFilters,
  SalePaymentRequest,
  SalePaymentResponse,
} from "../models";
import {
  getSaleAgentId,
  getSaleClientId,
  getSaleClientName,
  getSaleTravelDate,
} from "../models/domain-helpers";
import { AuthService } from "./auth.service";
import { VisibilityModeService } from "./visibility-mode.service";

@Injectable({ providedIn: "root" })
export class SalesService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly visibilityMode = inject(VisibilityModeService);
  private readonly api = `${environment.apiUrl}/sales`;

  // ── Local state ───────────────────────────────────────────────────────────
  readonly sales = signal<SaleResponse[]>([]);
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
    const term = f.search.trim().toLowerCase();
    const currentUserId = this.auth.currentUser()?.id ?? "";
    const restrictToCurrentUser =
      !this.auth.isAdmin() || this.visibilityMode.mode() === "MY_DATA";

    return this.sales().filter((s) => {
      const id = s.id ?? "";
      const clientName = getSaleClientName(s).toLowerCase();
      const destination = (s.destination ?? "").toLowerCase();
      const matchSearch =
        !f.search ||
        id.includes(f.search) ||
        clientName.includes(term) ||
        destination.includes(term);
      const matchStatus = !f.status || s.status === f.status;
      const matchClient = !f.clientId || getSaleClientId(s) === f.clientId;
      const matchAgent = !f.agentId || getSaleAgentId(s) === f.agentId;
      const matchVisibility =
        !restrictToCurrentUser || getSaleAgentId(s) === currentUserId;
      const travelDate = getSaleTravelDate(s);
      const matchDateFrom = !f.dateFrom || travelDate >= f.dateFrom;
      const matchDateTo = !f.dateTo || travelDate <= f.dateTo;

      return (
        matchSearch &&
        matchStatus &&
        matchClient &&
        matchAgent &&
        matchVisibility &&
        matchDateFrom &&
        matchDateTo
      );
    });
  });

  readonly visibleSales = computed(() => this.filtered());

  // ── API calls ─────────────────────────────────────────────────────────────
  loadAll() {
    this.loading.set(true);
    return this.http.get<SaleResponse[]>(this.api).pipe(
      tap((data) => {
        this.sales.set(data);
        this.loading.set(false);
      }),
    );
  }

  create(dto: SaleRequest) {
    console.log("Create sale payload:", dto);
    return this.http
      .post<SaleResponse>(this.api, dto)
      .pipe(tap((s) => this.sales.update((list) => [...list, s])));
  }

  update(id: string, dto: Partial<SaleRequest>) {
    return this.http
      .put<SaleResponse>(`${this.api}/${id}`, dto)
      .pipe(
        tap((updated) =>
          this.sales.update((list) =>
            list.map((s) => (s.id === id ? updated : s)),
          ),
        ),
      );
  }

  delete(id: string) {
    return this.http
      .delete(`${this.api}/${id}`)
      .pipe(
        tap(() => this.sales.update((list) => list.filter((s) => s.id !== id))),
      );
  }

  getById(id: string) {
    return this.http.get<SaleResponse>(`${this.api}/${id}`);
  }

  getPayments(saleId: string) {
    return this.http.get<SalePaymentResponse[]>(`${this.api}/${saleId}/payments`);
  }

  addPayment(saleId: string, dto: SalePaymentRequest) {
    return this.http.post<SaleResponse>(`${this.api}/${saleId}/payments`, dto);
  }

  deletePayment(saleId: string, paymentId: string) {
    return this.http.delete(`${this.api}/${saleId}/payments/${paymentId}`);
  }

  setFilter(key: keyof SaleFilters, value: string) {
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
}
