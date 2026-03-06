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

  isAdmin = this.auth.isAdmin;
  agency = this.auth.currentAgency;

  firstName = computed(
    () => this.auth.currentUser()?.name?.split(" ")[0] ?? "",
  );

  private readonly mySales = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return [];
    return this.isAdmin()
      ? this.salesSvc.sales()
      : this.salesSvc.sales().filter((s) => s.agentId === user.id);
  });

  recentSales = computed(() => this.mySales().slice(0, 4));
  pendingServices = computed(() =>
    this.mySales().flatMap((s) =>
      s.services.filter((sv) => sv.payStatus === "Pendiente"),
    ),
  );

  stats = computed(() => {
    const sales = this.mySales();
    const pending = this.pendingServices();
    const revenue = sales.reduce((a, s) => a + s.saleTotal, 0);
    const active = sales.filter(
      (s) => !["Cancelada", "Completada"].includes(s.status),
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
        sub: this.agency()?.name ?? "",
        icon: "👥",
        gradient: "bg-gradient-to-br from-violet-500 to-purple-600",
      },
      {
        label: "Pagos pendientes",
        value: pending.length,
        sub: "a proveedores",
        icon: "⚠️",
        gradient: "bg-gradient-to-br from-amber-500 to-orange-600",
      },
      {
        label: "Facturación est.",
        value: `$${(revenue / 1000).toFixed(1)}k`,
        sub: "USD equiv.",
        icon: "📈",
        gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
      },
    ];
  });

  agentStats = computed(() => {
    const agents = this.teamSvc
      .users()
      .filter((u) => u.role === "AGENT" && u.status === "active");
    const revenues = agents.map((a) => ({
      id: a.id,
      name: a.name,
      revenue: this.salesSvc
        .sales()
        .filter((s) => s.agentId === a.id)
        .reduce((acc, s) => acc + s.saleTotal, 0),
    }));
    const max = Math.max(...revenues.map((r) => r.revenue), 1);
    return revenues.map((r) => ({ ...r, pct: (r.revenue / max) * 100 }));
  });

  ngOnInit() {
    this.salesSvc.loadAll().subscribe();
    this.clientsSvc.loadAll().subscribe();
    this.teamSvc.loadUsers().subscribe();
    this.xr.fetchRate().subscribe();
  }

  getClientName(id: number): string {
    return this.clientsSvc.getById(id)?.name ?? "—";
  }
  getClientInitial(id: number): string {
    return (this.clientsSvc.getById(id)?.name ?? "?")[0].toUpperCase();
  }
  getAgentFirst(id: string): string {
    return this.teamSvc.getById(id)?.name?.split(" ")[0] ?? "";
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      Cotización: "bg-amber-500/10 text-amber-500",
      Confirmada: "bg-emerald-500/10 text-emerald-500",
      "En proceso": "bg-blue-500/10 text-blue-500",
      Completada: "bg-slate-500/10 text-slate-400",
      Cancelada: "bg-red-500/10 text-red-500",
    };
    return map[status] ?? "";
  }
}
