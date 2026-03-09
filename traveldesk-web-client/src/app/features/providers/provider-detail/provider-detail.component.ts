import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ProvidersService } from "../../../core/services/providers.service";
import { SalesService } from "../../../core/services/sales.service";
import {
  ServiceType,
  CreateProviderDto,
  ServiceBooking,
} from "../../../core/models";

@Component({
  selector: "app-provider-detail",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./provider-detail.component.html",
})
export class ProviderDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  providersSvc = inject(ProvidersService);
  salesSvc = inject(SalesService);

  providerId: string | null = null;
  isEditing = signal(false);
  isLoading = signal(true);
  errorMessage = signal("");
  successMessage = signal("");
  associatedBookings = signal<ServiceBooking[]>([]);

  categories: ServiceType[] = [
    "HOTEL",
    "AIRLINE",
    "TRANSPORT",
    "TOUR_OPERATOR",
    "INSURANCE",
    "OTHER",
  ];

  serviceTypeLabels: Record<ServiceType, string> = {
    HOTEL: "Hotel",
    AIRLINE: "Aéreo",
    TRANSPORT: "Transporte",
    TOUR_OPERATOR: "Operador de Tours",
    INSURANCE: "Seguro",
    OTHER: "Otro",
  };

  form: FormGroup = this.fb.group({
    name: ["", [Validators.required]],
    serviceType: ["HOTEL", [Validators.required]],
    currency: ["USD", [Validators.required]],
    email: ["", [Validators.email]],
    phone: [""],
    country: [""],
  });

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.providerId = params["id"]; // Mantener como string (UUID)
      this.loadProvider();
    });
  }

  loadProvider() {
    if (!this.providerId) return;

    this.providersSvc.getById(this.providerId).subscribe({
      next: (provider) => {
        this.form.patchValue(provider);
        this.loadAssociatedBookings();
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error("Error al cargar proveedor:", err);
        this.errorMessage.set("Proveedor no encontrado");
        this.isLoading.set(false);
      },
    });
  }

  loadAssociatedBookings() {
    // Cargar todas las ventas y filtrar los servicios que usen este proveedor
    this.salesSvc.sales().forEach((sale) => {
      const bookingsForProvider = sale.services.filter(
        (service) => service.providerId === this.providerId,
      );
      this.associatedBookings.update((current) => [
        ...current,
        ...bookingsForProvider,
      ]);
    });
  }

  save() {
    if (!this.providerId) return;

    this.errorMessage.set("");
    this.successMessage.set("");

    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach((key) => {
        const control = this.form.get(key);
        if (control?.errors) {
          console.log(`Error en ${key}:`, control.errors);
        }
      });
      this.form.markAllAsTouched();
      this.errorMessage.set(
        "Por favor completa todos los campos correctamente",
      );
      return;
    }

    const formData = this.form.getRawValue() as CreateProviderDto;
    console.log("Datos a actualizar:", formData);

    this.providersSvc.update(this.providerId, formData).subscribe({
      next: (response) => {
        console.log("Proveedor actualizado exitosamente:", response);
        this.successMessage.set("Proveedor actualizado exitosamente");
        this.isEditing.set(false);

        setTimeout(() => this.successMessage.set(""), 3000);
      },
      error: (err) => {
        console.error("Error al actualizar proveedor:", err);
        const errorMsg =
          err?.error?.message || "Error al actualizar el proveedor";
        this.errorMessage.set(errorMsg);
      },
    });
  }

  cancel() {
    this.isEditing.set(false);
    this.errorMessage.set("");
    this.successMessage.set("");
    this.loadProvider();
  }

  goBack() {
    this.router.navigate(["/app/providers"]);
  }

  catGradient(serviceType: ServiceType): string {
    const map: Record<ServiceType, string> = {
      HOTEL: "bg-gradient-to-br from-sky-500 to-blue-600",
      AIRLINE: "bg-gradient-to-br from-cyan-500 to-teal-600",
      TOUR_OPERATOR: "bg-gradient-to-br from-emerald-500 to-green-600",
      TRANSPORT: "bg-gradient-to-br from-amber-500 to-orange-600",
      INSURANCE: "bg-gradient-to-br from-rose-500 to-pink-600",
      OTHER: "bg-gradient-to-br from-slate-500 to-slate-600",
    };
    return map[serviceType];
  }

  getServiceTypeLabel(serviceType: any): string {
    return this.serviceTypeLabels[serviceType as ServiceType] || "Otro";
  }
}
