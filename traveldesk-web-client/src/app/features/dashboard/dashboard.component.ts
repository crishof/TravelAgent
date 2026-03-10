import { Component, inject, computed, OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { RouterLink } from "@angular/router";
import { SalesService } from "../../core/services/sales.service";
import { ClientsService } from "../../core/services/clients.service";
import { TeamService } from "../../core/services/team.service";
import { AuthService } from "../../core/services/auth.service";
import { ExchangeRateService } from "../../core/services/exchange-rate.service";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  private readonly salesSvc = inject(SalesService);
  private readonly clientsSvc = inject(ClientsService);
  private readonly teamSvc = inject(TeamService);
  private readonly xr = inject(ExchangeRateService);
  private readonly auth = inject(AuthService);

  firstName = computed(
    () => this.auth.currentUser()?.email?.split("@")[0] ?? "",
  );

  isAdmin = computed(() => this.auth.currentUser()?.role === "ADMIN");

  private readonly mySales = computed(() => {
    // Por ahora mostramos todas las ventas, después se puede filtrar por usuario si es necesario
    return this.salesSvc.sales();
  });

  recentSales = computed(() => this.mySales().slice(0, 4));

  pendingAmount = computed(() =>
    this.mySales()
      .filter((s) => s.status === "PENDING")
      .reduce((a, s) => a + s.amount, 0),
  );

  stats = computed(() => {
    const sales = this.mySales();
    const revenue = sales.reduce((a, s) => a + s.amount, 0);
    const active = sales.filter(
      (s) => !["CANCELLED", "COMPLETED"].includes(s.status),
    ).length;
    return [
      {
        label: "Ventas activas",
        value: active,
        sub: "en curso",
        icon: "🛒",
        gradient: "bg-gradient-to-br from-cyan-500 to-teal-600",
      },
      {
        label: "Clientes",
        value: this.clientsSvc.clients().length,
        sub: "registrados",
        icon: "👥",
        gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      },
      {
        label: "Monto pendiente",
        value: this.pendingAmount(),
        sub: "USD",
        icon: "⚠️",
        gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
      },
      {
        label: "Facturación total",
        value: `$${(revenue / 1000).toFixed(1)}k`,
        sub: "USD",
        icon: "📈",
        gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
      },
    ];
  });

  agentStats = computed(
    (): Array<{ id: string; name: string; revenue: number; pct: number }> => {
      // Por ahora simplificado, ya que no hay agentId en SaleResponse
      return [];
    },
  );

  ngOnInit() {
    this.salesSvc.loadAll().subscribe();
    this.clientsSvc.loadAll().subscribe();
    this.teamSvc.loadAll().subscribe();
    this.xr.fetchRate().subscribe();
  }

  getClientName(id: string): string {
    return this.clientsSvc.getById(id)?.fullName ?? "—";
  }
  getClientInitial(id: string): string {
    return (this.clientsSvc.getById(id)?.fullName ?? "?")[0].toUpperCase();
  }
  getAgentFirst(id: string): string {
    return this.teamSvc.getById(id)?.fullName?.split(" ")[0] ?? "";
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      PENDING: "bg-amber-500/10 text-amber-500",
      CONFIRMED: "bg-emerald-500/10 text-emerald-500",
      IN_PROGRESS: "bg-blue-500/10 text-blue-500",
      COMPLETED: "bg-slate-500/10 text-slate-400",
      CANCELLED: "bg-red-500/10 text-red-500",
    };
    return map[status] ?? "";
  }
}
