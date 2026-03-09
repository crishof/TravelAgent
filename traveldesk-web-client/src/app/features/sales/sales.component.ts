import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormsModule,
} from "@angular/forms";
import { SalesService } from "../../core/services/sales.service";
import { ClientsService } from "../../core/services/clients.service";
import { ProvidersService } from "../../core/services/providers.service";
import { TeamService } from "../../core/services/team.service";
import { ExchangeRateService } from "../../core/services/exchange-rate.service";
import { AuthService } from "../../core/services/auth.service";
import {
  Sale,
  CreateSaleDto,
  CreateServiceDto,
  SaleStatus,
  Currency,
} from "../../core/models";

@Component({
  selector: "app-sales",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./sales.component.html",
})
export class SalesComponent implements OnInit {
  salesSvc = inject(SalesService);
  clientsSvc = inject(ClientsService);
  providersSvc = inject(ProvidersService);
  teamSvc = inject(TeamService);
  xr = inject(ExchangeRateService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  isAdmin = this.auth.isAdmin;

  expandedId = signal<number | null>(null);
  showNewSale = signal(false);
  showAddService = signal<number | null>(null);
  editingSale = signal<Sale | null>(null);
  editTotalValue = 0;
  isNewClient = signal(false);
  manualRateInput = signal("");

  saleStatuses: SaleStatus[] = [
    "Cotización",
    "Confirmada",
    "En proceso",
    "Completada",
    "Cancelada",
  ];

  saleForm = this.fb.group({
    clientId: [""],
    newClientName: [""],
    newClientEmail: [""],
    saleCurrency: ["USD"],
    status: ["Cotización"],
    travelDate: [""],
    saleTotal: [0],
    agentId: [this.auth.currentUser()?.id ?? ""],
  });

  serviceForm = this.fb.group({
    name: ["", Validators.required],
    providerId: ["", Validators.required],
    currency: ["USD"],
    netCost: [0, [Validators.required, Validators.min(0.01)]],
    salePrice: [null],
    travelDate: [""],
    notes: [""],
  });

  ngOnInit() {
    this.salesSvc.loadAll().subscribe();
    this.clientsSvc.loadAll().subscribe();
    this.providersSvc.loadAll().subscribe();
    this.teamSvc.loadUsers().subscribe();
    this.xr.fetchRate().subscribe();
  }

  toggleExpand(id: number) {
    this.expandedId.update((cur) => (cur === id ? null : id));
  }

  openAddService(saleId: number) {
    this.showAddService.set(saleId);
    this.serviceForm.reset({ currency: "USD", netCost: 0 });
  }

  openEditTotal(sale: Sale) {
    this.editingSale.set(sale);
    this.editTotalValue = sale.saleTotal;
  }

  confirmEditTotal() {
    const sale = this.editingSale();
    if (!sale) return;
    this.salesSvc
      .updateTotal(sale.id, { saleTotal: this.editTotalValue })
      .subscribe();
    this.editingSale.set(null);
  }

  createSale() {
    const v = this.saleForm.value;
    const dto: CreateSaleDto = {
      clientId: Number(v.clientId) || 0,
      agentId: v.agentId || this.auth.currentUser()!.id,
      status: (v.status as SaleStatus) || "Cotización",
      saleCurrency: (v.saleCurrency as Currency) || "USD",
      travelDate: v.travelDate || "",
      exchangeRate: this.xr.rate(),
      saleTotal: Number(v.saleTotal) || 0,
    };
    this.salesSvc.create(dto).subscribe();
    this.showNewSale.set(false);
    this.saleForm.reset({
      saleCurrency: "USD",
      status: "Cotización",
      agentId: this.auth.currentUser()?.id,
    });
  }

  addService() {
    const saleId = this.showAddService();
    if (!saleId || this.serviceForm.invalid) return;
    const v = this.serviceForm.value;
    const dto: CreateServiceDto = {
      name: v.name!,
      providerId: Number(v.providerId),
      currency: (v.currency as Currency) || "USD",
      netCost: Number(v.netCost),
      salePrice: v.salePrice ? Number(v.salePrice) : null,
      travelDate: v.travelDate || "",
      notes: v.notes || "",
    };
    this.salesSvc.addService(saleId, dto).subscribe();
    this.showAddService.set(null);
  }

  deleteService(saleId: number, serviceId: number) {
    if (confirm("¿Eliminar este servicio?")) {
      this.salesSvc.removeService(saleId, serviceId).subscribe();
    }
  }

  onManualRateChange(event: Event) {
    const val = Number.parseFloat((event.target as HTMLInputElement).value);
    this.manualRateInput.set((event.target as HTMLInputElement).value);
    this.xr.setManualRate(Number.isNaN(val) ? null : val);
  }

  getVal(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  getClientName(id: number): string {
    return this.clientsSvc.getById(id)?.name ?? "—";
  }
  getClientInitial(id: number): string {
    return (this.clientsSvc.getById(id)?.name ?? "?")[0].toUpperCase();
  }
  getProviderName(id: number): string {
    return this.providersSvc.getById(id)?.name ?? "—";
  }
  getAgentName(id: string): string {
    return this.teamSvc.getById(id)?.fullName?.split(" ")[0] ?? "";
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

  statusDot(status: string): string {
    const map: Record<string, string> = {
      Cotización: "bg-amber-500",
      Confirmada: "bg-emerald-500",
      "En proceso": "bg-blue-500",
      Completada: "bg-slate-400",
      Cancelada: "bg-red-500",
    };
    return map[status] ?? "";
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
