import { Component, computed, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BookingsService } from "../../core/services/bookings.service";
import { ClientsService } from "../../core/services/clients.service";
import { SuppliersService } from "../../core/services/suppliers.service";
import { BookingFilters } from "../../core/models/models";

@Component({
  selector: "app-bookings",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./bookings.component.html",
})
export class BookingsComponent implements OnInit {
  readonly bookingsSvc = inject(BookingsService);
  readonly clientsSvc = inject(ClientsService);
  readonly suppliersSvc = inject(SuppliersService);

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
          !booking.reference.toLowerCase().includes(search) &&
          !booking.passengerName.toLowerCase().includes(search)
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

  constructor() {}

  ngOnInit() {
    this.bookingsSvc.loadAll().subscribe();
    this.clientsSvc.loadAll().subscribe();
    this.suppliersSvc.loadAll().subscribe();
  }

  setFilter<K extends keyof BookingFilters>(key: K, value: BookingFilters[K]) {
    this.filters.update((f) => ({ ...f, [key]: value }));
  }

  getVal(event: Event): string {
    return (event.target as HTMLSelectElement | HTMLInputElement).value;
  }
}
