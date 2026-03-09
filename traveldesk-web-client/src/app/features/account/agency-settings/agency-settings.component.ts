import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";

interface AgencyForm {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  defaultCurrency?: string;
  logo?: string;
}

@Component({
  selector: "app-agency-settings",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900">
          Configuración de Agencia
        </h1>
        <p class="text-slate-600 mt-1">
          Administra la información de tu agencia de viajes
        </p>
      </div>

      <div *ngIf="currentAgency()" class="space-y-6">
        <!-- Logo Section -->
        <div class="bg-white rounded-lg border border-slate-200 p-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">
            Logo de Agencia
          </h2>
          <div class="flex gap-4">
            <div
              class="w-24 h-24 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center border-2 border-dashed border-slate-300"
            >
              <img
                *ngIf="currentAgency()?.logo"
                [src]="currentAgency()?.logo"
                alt="Logo"
                class="w-full h-full object-cover rounded-lg"
              />
              <span
                *ngIf="!currentAgency()?.logo"
                class="text-slate-400 text-2xl"
              >
                📷
              </span>
            </div>
            <div class="flex flex-col justify-center gap-2">
              <label
                class="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition"
              >
                Cambiar Logo
                <input
                  type="file"
                  accept="image/*"
                  (change)="onLogoChange($event)"
                  hidden
                />
              </label>
              <button
                *ngIf="currentAgency()?.logo"
                type="button"
                (click)="removeLogo()"
                class="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Agency Info -->
        <div class="bg-white rounded-lg border border-slate-200 p-6">
          <h2 class="text-lg font-semibold text-slate-900 mb-4">
            Información de Agencia
          </h2>
          <form [formGroup]="agencyForm" class="space-y-4">
            <div class="grid gap-4 md:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Nombre de la Agencia
                </label>
                <input
                  type="text"
                  formControlName="name"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: TravelMundo"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Email de Contacto
                </label>
                <input
                  type="email"
                  formControlName="email"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="info@agencia.com"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  formControlName="phone"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">
                  Moneda por Defecto
                </label>
                <select
                  formControlName="defaultCurrency"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD - Dólar Estadounidense</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">
                Dirección
              </label>
              <textarea
                formControlName="address"
                rows="3"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Calle Principal 123, Ciudad, País"
              ></textarea>
            </div>

            <div class="flex gap-3 justify-end pt-4 border-t border-slate-200">
              <button
                type="button"
                (click)="resetForm()"
                class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                (click)="saveChanges()"
                [disabled]="isSaving()"
                class="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
              >
                {{ isSaving() ? "Guardando..." : "Guardar Cambios" }}
              </button>
            </div>
          </form>
        </div>

        <!-- Plan Info -->
        <div
          class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6"
        >
          <h2 class="text-lg font-semibold text-slate-900 mb-4">
            Plan de Suscripción
          </h2>
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <span class="text-sm text-slate-600">Plan Actual</span>
              <p class="text-lg font-semibold text-blue-600">
                {{ currentAgency()?.plan }}
              </p>
            </div>
            <div>
              <span class="text-sm text-slate-600">Desde</span>
              <p class="text-slate-900">
                {{ currentAgency()?.createdAt | date: "d/M/yyyy" }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!currentAgency()" class="text-center py-12">
        <p class="text-slate-600">No hay información de agencia disponible</p>
      </div>
    </div>
  `,
  styles: [],
})
export class AgencySettingsComponent implements OnInit {
  auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  currentAgency = this.auth.currentAgency;
  isSaving = signal(false);

  agencyForm = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.email]],
    phone: [""],
    address: [""],
    defaultCurrency: ["USD"],
  });

  ngOnInit() {
    const agency = this.currentAgency();
    if (agency) {
      this.agencyForm.patchValue({
        name: agency.name,
        defaultCurrency: "USD",
      });
    }
  }

  saveChanges() {
    if (this.agencyForm.invalid) {
      this.agencyForm.markAllAsTouched();
      return;
    }
    this.isSaving.set(true);
    // TODO: Implementar llamada a API cuando el backend esté listo
    setTimeout(() => {
      console.log("Cambios guardados:", this.agencyForm.value);
      this.isSaving.set(false);
    }, 500);
  }

  resetForm() {
    const agency = this.currentAgency();
    if (agency) {
      this.agencyForm.patchValue({
        name: agency.name,
        defaultCurrency: "USD",
      });
    }
  }

  onLogoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // TODO: Implementar upload a API
        console.log("Logo seleccionado:", file.name);
      };
      reader.readAsDataURL(file);
    }
  }

  removeLogo() {
    // TODO: Implementar eliminación de logo en API
    console.log("Logo eliminado");
  }
}
