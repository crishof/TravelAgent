import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { BookingResponse, BookingRequest, BookingFilters } from "../models";

@Injectable({ providedIn: "root" })
export class BookingsService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/bookings`;

  readonly bookings = signal<BookingResponse[]>([]);
  readonly loading = signal(false);
  readonly filters = signal<BookingFilters>({
    search: "",
    status: "",
    customerId: "",
    supplierId: "",
  });

  readonly filtered = computed(() => {
    const f = this.filters();
    return this.bookings().filter((b) => {
      const matchSearch =
        !f.search ||
        b.reference.toLowerCase().includes(f.search.toLowerCase()) ||
        b.passengerName.toLowerCase().includes(f.search.toLowerCase()) ||
        b.destination.toLowerCase().includes(f.search.toLowerCase());
      const matchStatus = !f.status || b.status === f.status;
      const matchCustomer = !f.customerId || b.customerId === f.customerId;
      const matchSupplier = !f.supplierId || b.supplierId === f.supplierId;
      return matchSearch && matchStatus && matchCustomer && matchSupplier;
    });
  });

  loadAll() {
    this.loading.set(true);
    return this.http.get<BookingResponse[]>(this.api).pipe(
      tap((data) => {
        this.bookings.set(data);
        this.loading.set(false);
      }),
    );
  }

  create(dto: BookingRequest) {
    return this.http
      .post<BookingResponse>(this.api, dto)
      .pipe(tap((b) => this.bookings.update((list) => [...list, b])));
  }

  update(id: string, dto: Partial<BookingRequest>) {
    return this.http
      .put<BookingResponse>(`${this.api}/${id}`, dto)
      .pipe(
        tap((updated) =>
          this.bookings.update((list) =>
            list.map((b) => (b.id === id ? updated : b)),
          ),
        ),
      );
  }

  delete(id: string) {
    return this.http
      .delete(`${this.api}/${id}`)
      .pipe(
        tap(() =>
          this.bookings.update((list) => list.filter((b) => b.id !== id)),
        ),
      );
  }

  getById(id: string) {
    return this.http.get<BookingResponse>(`${this.api}/${id}`);
  }
}
