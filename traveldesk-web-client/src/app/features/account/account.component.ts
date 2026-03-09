import { Component, inject, computed, signal, OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { AuthService } from "../../core/services/auth.service";
import { SalesService } from "../../core/services/sales.service";
import { TeamService } from "../../core/services/team.service";
import { CommissionAccountComponent } from "./commission-account/commission-account.component";

@Component({
  selector: "app-account",
  standalone: true,
  imports: [CommonModule, CurrencyPipe, CommissionAccountComponent],
  templateUrl: "./account.component.html",
})
export class AccountComponent implements OnInit {
  auth = inject(AuthService);
  private readonly salesSvc = inject(SalesService);
  private readonly teamSvc = inject(TeamService);

  activeTab = signal<"profile" | "commissions" | "sales">("profile");
  user = this.auth.currentUser;

  mySales = computed(() =>
    this.salesSvc.sales().filter((s) => s.agentId === this.user()?.id),
  );

  myCommissions = computed(() =>
    this.teamSvc.commissions().filter((c) => c.agentId === this.user()?.id),
  );

  stats = computed(() => {
    const uid = this.user()?.id ?? "";
    const earned = this.teamSvc.getTotalEarned(uid);
    const revenue = this.mySales().reduce((a, s) => a + s.saleTotal, 0);
    return [
      {
        label: "Ventas realizadas",
        value: this.mySales().length,
        gradient: "from-cyan-500 to-teal-600",
      },
      {
        label: "Facturación total",
        value: `$${(revenue / 1000).toFixed(1)}k`,
        gradient: "from-violet-500 to-purple-600",
      },
      {
        label: "Total comisiones",
        value: `$${earned.toFixed(2)}`,
        gradient: "from-emerald-500 to-green-600",
      },
      {
        label: "Pendiente cobro",
        value: `$${this.teamSvc.getPending(uid).toFixed(2)}`,
        gradient: "from-amber-500 to-orange-600",
      },
    ];
  });

  ngOnInit() {
    this.salesSvc.loadAll().subscribe();
    this.teamSvc.loadCommissions(this.user()?.id).subscribe();
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
