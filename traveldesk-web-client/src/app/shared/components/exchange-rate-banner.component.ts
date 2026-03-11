import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ExchangeRateService } from "../../core/services/exchange-rate.service";

@Component({
  selector: "app-exchange-rate-banner",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div
      class="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 py-3 border-b border-slate-700"
    >
      <div
        class="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4"
      >
        <!-- Display current rate -->
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-sm">EUR</span>
            <span class="text-xs text-slate-400">=</span>
            <span class="font-semibold text-sm">{{ xr.displayRate() }}</span>
            <span class="font-semibold text-sm">USD</span>
          </div>

          <div class="text-xs text-slate-400">
            {{ xr.isManual() ? "(Manual)" : "(API)" }}
          </div>
        </div>

        <!-- Manual rate toggle -->
        <div class="flex items-center gap-2">
          <button
            type="button"
            (click)="toggleManualInput()"
            class="text-xs px-3 py-1 rounded transition-colors"
            [class.bg-blue-600]="showManualInput()"
            [class.bg-slate-700]="!showManualInput()"
            [class.hover:bg-blue-700]="showManualInput()"
            [class.hover:bg-slate-600]="!showManualInput()"
          >
            {{ showManualInput() ? "Cancelar" : "Tasa manual" }}
          </button>

          <button
            *ngIf="xr.isManual()"
            type="button"
            (click)="clearManualRate()"
            class="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 transition-colors"
          >
            Reset
          </button>
        </div>

        <!-- Manual input -->
        <div *ngIf="showManualInput()" class="w-full flex items-center gap-2">
          <span class="text-sm text-slate-400">1 EUR =</span>
          <input
            type="number"
            [(ngModel)]="manualRateInput"
            placeholder="Ej: 1.085"
            step="0.0001"
            min="0"
            class="w-24 px-2 py-1 rounded bg-slate-700 text-white text-sm border border-slate-600 focus:border-blue-500 focus:outline-none"
          />
          <span class="text-sm text-slate-400">USD</span>
          <button
            type="button"
            (click)="applyManualRate()"
            class="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class ExchangeRateBannerComponent {
  xr = inject(ExchangeRateService);
  showManualInput = signal(false);
  manualRateInput = signal("");

  toggleManualInput() {
    this.showManualInput.update((v) => !v);
    if (!this.showManualInput()) {
      this.manualRateInput.set("");
    } else {
      this.manualRateInput.set(this.xr.displayRate());
    }
  }

  applyManualRate() {
    const rate = Number.parseFloat(this.manualRateInput());
    if (!Number.isNaN(rate) && rate > 0) {
      this.xr.setManualRate(rate);
      this.showManualInput.set(false);
      this.manualRateInput.set("");
    }
  }

  clearManualRate() {
    this.xr.clearManual();
    this.manualRateInput.set("");
  }
}
