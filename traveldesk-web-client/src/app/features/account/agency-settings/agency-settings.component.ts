import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";

@Component({
  selector: "app-agency-settings",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
          Configuración
        </h1>
        <p class="text-slate-600 dark:text-slate-400 mt-1">
          Administra tus preferencias
        </p>
      </div>

      <div
        class="bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 p-6"
      >
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-6">
          Moneda predeterminada
        </h2>
        <form
          [formGroup]="settingsForm"
          (ngSubmit)="saveChanges()"
          class="space-y-4"
        >
          <div>
            <label
              class="block text-sm font-medium text-slate-900 dark:text-white mb-2"
            >
              Moneda
            </label>
            <select
              formControlName="currency"
              class="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            >
              <option value="USD">Dólar estadounidense (USD)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="GBP">Libra esterlina (GBP)</option>
              <option value="ARS">Peso argentino (ARS)</option>
            </select>
          </div>

          <div class="flex gap-3 pt-4">
            <button
              type="submit"
              [disabled]="isSaving() || settingsForm.invalid"
              class="px-6 py-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition disabled:opacity-60"
            >
              {{ isSaving() ? "Guardando..." : "Guardar cambios" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [],
})
export class AgencySettingsComponent {
  auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  isSaving = signal(false);

  settingsForm = this.fb.group({
    currency: ["USD", Validators.required],
  });

  saveChanges() {
    if (this.settingsForm.invalid || this.isSaving()) {
      return;
    }
    this.isSaving.set(true);
    setTimeout(() => {
      console.log("Cambios guardados:", this.settingsForm.value);
      this.isSaving.set(false);
    }, 500);
  }
}
