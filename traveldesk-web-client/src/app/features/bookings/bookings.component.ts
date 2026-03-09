import { Component, inject, computed, signal, OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { SalesService } from "../../core/services/sales.service";
import { ClientsService } from "../../core/services/clients.service";
import { ProvidersService } from "../../core/services/providers.service";
import { TeamService } from "../../core/services/team.service";
import { ExchangeRateService } from "../../core/services/exchange-rate.service";
import { AuthService } from "../../core/services/auth.service";
import { BookingFilters } from "../../core/models";

@Component({
  selector: "app-bookings",
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: "./bookings.component.html",
})
export class BookingsComponent implements OnInit {
  salesSvc = inject(SalesService);
  clientsSvc = inject(ClientsService);
  providersSvc = inject(ProvidersService);
  teamSvc = inject(TeamService);
  xr = inject(ExchangeRateService);
  private readonly auth = inject(AuthService);

  isAdmin = this.auth.isAdmin;
  filters = signal<BookingFilters>({
    payStatus: "",
    providerId: "",
    clientId: "",
    agentId: "",
    dateFrom: "",
  });

  private readonly visibleSales = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.isAdmin()
      ? this.salesSvc.sales()
      : this.salesSvc.sales().filter((s) => s.agentId === user.id);
  });

  filteredBookings = computed(() => {
    const f = this.filters();
    return this.visibleSales()
      .flatMap((sale) =>
        sale.services.map((svc) => ({
          ...svc,
          saleId: sale.id,
          saleCurrency: sale.saleCurrency,
          providerName:
            this.providersSvc.providers().find((p) => p.id === svc.providerId)
              ?.name ?? "—",
          clientName: this.clientsSvc.getById(sale.clientId)?.name ?? "—",
          agentFirst:
            this.teamSvc.getById(sale.agentId)?.fullName?.split(" ")[0] ?? "—",
          showConversion: svc.currency !== sale.saleCurrency,
          convertedCost: this.salesSvc.convert(
            svc.netCost,
            svc.currency,
            sale.saleCurrency,
            this.xr.rate(),
          ),
        })),
      )
      .filter(
        (s) =>
          (!f.payStatus || s.payStatus === f.payStatus) &&
          (!f.providerId || String(s.providerId) === f.providerId) &&
          (!f.clientId ||
            s.clientName ===
              this.clientsSvc.getById(Number(f.clientId))?.name) &&
          (!f.agentId ||
            this.teamSvc.getById(f.agentId)?.fullName?.split(" ")[0] ===
              s.agentFirst) &&
          (!f.dateFrom || s.travelDate >= f.dateFrom),
      );
  });

  pendingCount = computed(
    () =>
      this.filteredBookings().filter((s) => s.payStatus === "Pendiente").length,
  );
  pendingAmount = computed(() =>
    this.filteredBookings()
      .filter((s) => s.payStatus === "Pendiente")
      .reduce((a, s) => a + s.netCost, 0),
  );

  ngOnInit() {
    this.salesSvc.loadAll().subscribe();
    this.clientsSvc.loadAll().subscribe();
    this.providersSvc.loadAll().subscribe();
    this.teamSvc.loadUsers().subscribe();
  }

  setFilter<K extends keyof BookingFilters>(key: K, value: BookingFilters[K]) {
    this.filters.update((f) => ({ ...f, [key]: value }));
  }

  togglePayStatus(saleId: number, svcId: number, current: string) {
    const next = current === "Pendiente" ? "Pagado" : "Pendiente";
    this.salesSvc
      .updateServicePayStatus(saleId, svcId, next as any)
      .subscribe();
  }

  getVal(event: Event): string {
    return (event.target as HTMLSelectElement | HTMLInputElement).value;
  }

  payStatusClass(status: string): string {
    const map: Record<string, string> = {
      Pendiente: "bg-amber-500/10 text-amber-500",
      Pagado: "bg-emerald-500/10 text-emerald-500",
      Vencido: "bg-red-500/10 text-red-500",
    };
    return map[status] ?? "";
  }
}
