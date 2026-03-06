import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { Client, CreateClientDto } from "../models";

@Injectable({ providedIn: "root" })
export class ClientsService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/clients`;

  readonly clients = signal<Client[]>([]);
  readonly loading = signal(false);

  loadAll() {
    this.loading.set(true);
    return this.http.get<Client[]>(this.api).pipe(
      tap((data) => {
        this.clients.set(data);
        this.loading.set(false);
      }),
    );
  }

  create(dto: CreateClientDto) {
    return this.http
      .post<Client>(this.api, dto)
      .pipe(tap((c) => this.clients.update((list) => [...list, c])));
  }

  update(id: number, dto: Partial<CreateClientDto>) {
    return this.http
      .put<Client>(`${this.api}/${id}`, dto)
      .pipe(
        tap((updated) =>
          this.clients.update((list) =>
            list.map((c) => (c.id === id ? updated : c)),
          ),
        ),
      );
  }

  delete(id: number) {
    return this.http
      .delete(`${this.api}/${id}`)
      .pipe(
        tap(() =>
          this.clients.update((list) => list.filter((c) => c.id !== id)),
        ),
      );
  }

  getById(id: number): Client | undefined {
    return this.clients().find((c) => c.id === id);
  }
}
