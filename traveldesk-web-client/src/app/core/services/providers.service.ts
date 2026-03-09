import { Injectable, inject, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { Provider, CreateProviderDto } from "../models";

@Injectable({ providedIn: "root" })
export class ProvidersService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/providers`;

  readonly providers = signal<Provider[]>([]);
  readonly loading = signal(false);

  loadAll() {
    this.loading.set(true);
    return this.http.get<Provider[]>(this.api).pipe(
      tap((data) => {
        this.providers.set(data);
        this.loading.set(false);
      }),
    );
  }

  create(dto: CreateProviderDto) {
    return this.http
      .post<Provider>(this.api, dto)
      .pipe(tap((p) => this.providers.update((list) => [...list, p])));
  }

  update(id: string, dto: Partial<CreateProviderDto>) {
    return this.http
      .put<Provider>(`${this.api}/${id}`, dto)
      .pipe(
        tap((updated) =>
          this.providers.update((list) =>
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
          this.providers.update((list) => list.filter((p) => p.id !== id)),
        ),
      );
  }

  getById(id: string | number) {
    return this.http
      .get<Provider>(`${this.api}/${id}`)
      .pipe(
        tap((provider) =>
          this.providers.update((list) =>
            list.map((p) => (p.id === provider.id ? provider : p)),
          ),
        ),
      );
  }
}
