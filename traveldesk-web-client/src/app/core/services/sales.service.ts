import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { SaleResponse, SaleRequest, SaleFilters } from "../models";

@Injectable({ providedIn: "root" })
export class SalesService {
  private readonly http = inject(HttpClient);
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
    return this.sales().filter((s) => {
      const matchSearch =
        !f.search ||
        s.id.includes(f.search) ||
        s.destination.toLowerCase().includes(f.search.toLowerCase());
      const matchStatus = !f.status || s.status === f.status;
      const matchClient = !f.clientId || s.customerId === f.clientId;
      return matchSearch && matchStatus && matchClient;
    });
  });

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
