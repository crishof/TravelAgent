import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { CustomerResponse, CustomerRequest } from "../models";

@Injectable({ providedIn: "root" })
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/customers`;

  readonly clients = signal<CustomerResponse[]>([]);
  readonly loading = signal(false);

  loadAll() {
    this.loading.set(true);
    return this.http.get<CustomerResponse[]>(this.api).pipe(
      tap((data) => {
        this.clients.set(data);
        this.loading.set(false);
      }),
    );
  }

  create(dto: CustomerRequest) {
    return this.http
      .post<CustomerResponse>(this.api, dto)
      .pipe(tap((c) => this.clients.update((list) => [...list, c])));
  }

  update(id: string, dto: Partial<CustomerRequest>) {
    return this.http
      .put<CustomerResponse>(`${this.api}/${id}`, dto)
      .pipe(
        tap((updated) =>
          this.clients.update((list) =>
            list.map((c) => (c.id === id ? updated : c)),
          ),
        ),
      );
  }

  delete(id: string) {
    return this.http
      .delete(`${this.api}/${id}`)
      .pipe(
        tap(() =>
          this.clients.update((list) => list.filter((c) => c.id !== id)),
        ),
      );
  }

  getById(id: string): CustomerResponse | undefined {
    return this.clients().find((c) => c.id === id);
  }
}
