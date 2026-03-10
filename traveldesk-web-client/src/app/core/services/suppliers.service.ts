import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { Supplier, CreateSupplierDto } from "../models";

@Injectable({ providedIn: "root" })
export class SuppliersService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/suppliers`;

  readonly suppliers = signal<Supplier[]>([]);
  readonly loading = signal(false);

  loadAll() {
    this.loading.set(true);
    return this.http.get<Supplier[]>(this.api).pipe(
      tap((data) => {
        this.suppliers.set(data);
        this.loading.set(false);
      }),
    );
  }

  create(dto: CreateSupplierDto) {
    return this.http
      .post<Supplier>(this.api, dto)
      .pipe(tap((p) => this.suppliers.update((list) => [...list, p])));
  }

  update(id: string, dto: Partial<CreateSupplierDto>) {
    return this.http
      .put<Supplier>(`${this.api}/${id}`, dto)
      .pipe(
        tap((updated) =>
          this.suppliers.update((list) =>
            list.map((p) => (p.id === id ? updated : p)),
          ),
        ),
      );
  }

  delete(id: string) {
    return this.http
      .delete(`${this.api}/${id}`)
      .pipe(
        tap(() =>
          this.suppliers.update((list) => list.filter((p) => p.id !== id)),
        ),
      );
  }

  getById(id: string | number) {
    return this.http
      .get<Supplier>(`${this.api}/${id}`)
      .pipe(
        tap((supplier) =>
          this.suppliers.update((list) =>
            list.map((p) => (p.id === supplier.id ? supplier : p)),
          ),
        ),
      );
  }
}
