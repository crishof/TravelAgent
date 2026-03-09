import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ProvidersService } from "../../core/services/providers.service";
import { ServiceType, CreateProviderDto } from "../../core/models";

@Component({
  selector: "app-providers",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./providers.component.html",
})
export class ProvidersComponent implements OnInit {
  providersSvc = inject(ProvidersService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  showNew = signal(false);
  errorMessage = signal("");
  successMessage = signal("");

  categories: ServiceType[] = [
    "HOTEL",
    "AIRLINE",
    "TRANSPORT",
    "TOUR_OPERATOR",
    "INSURANCE",
    "OTHER",
  ];

  // Mapeo de tipos de servicio a etiquetas en español
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
    this.loadProviders();
  }

  loadProviders() {
    this.providersSvc.loading.set(true);
    this.providersSvc.loadAll().subscribe({
      error: (err) => {
        console.error("Error al cargar proveedores:", err);
        this.providersSvc.loading.set(false);
      },
    });
  }

  save() {
    console.log("Intentando guardar proveedor...");
    this.errorMessage.set("");
    this.successMessage.set("");

    if (this.form.invalid) {
      // Log detallado de errores por campo
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
    console.log("Datos a enviar:", formData);

    this.providersSvc.create(formData).subscribe({
      next: (response) => {
        console.log("Proveedor creado exitosamente:", response);
        this.successMessage.set("Proveedor creado exitosamente");
        this.showNew.set(false);
        this.form.reset({ serviceType: "HOTEL", currency: "USD" });

        // Limpiar mensaje de éxito después de 3 segundos
        setTimeout(() => this.successMessage.set(""), 3000);
      },
      error: (err) => {
        console.error("Error al crear proveedor:", err);
        const errorMsg = err?.error?.message || "Error al crear el proveedor";
        this.errorMessage.set(errorMsg);
      },
    });
  }

  cancel() {
    this.showNew.set(false);
    this.form.reset({ serviceType: "HOTEL", currency: "USD" });
    this.errorMessage.set("");
    this.successMessage.set("");
  }

  catGradient(serviceType: ServiceType): string {
    const map: Partial<Record<ServiceType, string>> = {
      HOTEL: "bg-gradient-to-br from-sky-500 to-blue-600",
      AIRLINE: "bg-gradient-to-br from-cyan-500 to-teal-600",
      TOUR_OPERATOR: "bg-gradient-to-br from-emerald-500 to-green-600",
      TRANSPORT: "bg-gradient-to-br from-amber-500 to-orange-600",
      INSURANCE: "bg-gradient-to-br from-rose-500 to-pink-600",
      OTHER: "bg-gradient-to-br from-slate-500 to-slate-600",
    };
    return map[serviceType] ?? map["OTHER"]!;
  }

  selectProvider(providerId: string) {
    this.router.navigate(["/app/providers", providerId]);
  }
}
