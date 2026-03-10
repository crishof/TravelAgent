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
import { SuppliersService } from "../../core/services/suppliers.service";
import { BookingsService } from "../../core/services/bookings.service";
import { TeamService } from "../../core/services/team.service";
import { ExchangeRateService } from "../../core/services/exchange-rate.service";
import { AuthService } from "../../core/services/auth.service";
import { SaleRequest, BookingRequest } from "../../core/models";

@Component({
  selector: "app-sales",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: "./sales.component.html",
})
export class SalesComponent implements OnInit {
  salesSvc = inject(SalesService);
  clientsSvc = inject(ClientsService);
  suppliersSvc = inject(SuppliersService);
  bookingsSvc = inject(BookingsService);
  teamSvc = inject(TeamService);
  xr = inject(ExchangeRateService);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  isAdmin = this.auth.isLoggedIn;

  showNewSale = signal(false);
  showAddService = signal<string | null>(null);
  manualRateInput = signal("");

  saleStatuses: string[] = [
    "Cotización",
    "Confirmada",
    "En proceso",
    "Completada",
    "Cancelada",
  ];

  saleForm = this.fb.group({
    customerId: ["", Validators.required],
    supplierId: ["", Validators.required],
    destination: ["", Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    status: ["Cotización", Validators.required],
  });

  bookingForm = this.fb.group({
    customerId: ["", Validators.required],
    supplierId: ["", Validators.required],
    reference: ["", Validators.required],
    passengerName: ["", Validators.required],
    destination: ["", Validators.required],
    departureDate: ["", Validators.required],
    returnDate: [""],
    status: ["PENDING", Validators.required],
  });

  ngOnInit() {
    this.salesSvc.loadAll().subscribe();
    this.clientsSvc.loadAll().subscribe();
    this.suppliersSvc.loadAll().subscribe();
    this.teamSvc.loadAll().subscribe();
    this.xr.loadRate().subscribe();
  }

  openAddService(saleId: string) {
    this.showAddService.set(saleId);
    this.bookingForm.reset({ status: "PENDING" });
  }

  createSale() {
    if (this.saleForm.invalid) return;

    const v = this.saleForm.value;
    const dto: SaleRequest = {
      customerId: v.customerId!,
      supplierId: v.supplierId!,
      destination: v.destination!,
      amount: Number(v.amount),
      status: v.status!,
    };

    this.salesSvc.create(dto).subscribe({
      next: () => {
        this.showNewSale.set(false);
        this.saleForm.reset();
      },
      error: (err) => console.error("Error creating sale:", err),
    });
  }

  addService() {
    if (this.bookingForm.invalid) return;

    const v = this.bookingForm.value;
    const dto: BookingRequest = {
      customerId: v.customerId!,
      supplierId: v.supplierId!,
      reference: v.reference!,
      passengerName: v.passengerName!,
      destination: v.destination!,
      departureDate: v.departureDate!,
      returnDate: v.returnDate || undefined,
      status: v.status!,
    };

    this.bookingsSvc.create(dto).subscribe({
      next: () => {
        this.showAddService.set(null);
        this.bookingForm.reset({ status: "PENDING" });
      },
      error: (err) => console.error("Error creating booking:", err),
    });
  }

  onManualRateChange(event: Event) {
    const val = Number.parseFloat((event.target as HTMLInputElement).value);
    this.manualRateInput.set((event.target as HTMLInputElement).value);
    this.xr.setManualRate(Number.isNaN(val) ? null : val);
  }

  getVal(event: Event): string {
    return (event.target as HTMLInputElement | HTMLSelectElement).value;
  }

  getClientName(id: string): string {
    return this.clientsSvc.getById(id)?.fullName ?? "—";
  }

  getClientInitial(id: string): string {
    return (this.clientsSvc.getById(id)?.fullName ?? "?")[0].toUpperCase();
  }

  getSupplierName(id: string): string {
    return this.suppliersSvc.suppliers().find((p) => p.id === id)?.name ?? "—";
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
}
