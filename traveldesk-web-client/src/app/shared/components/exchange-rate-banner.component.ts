import { Component, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExchangeRateService } from "../../core/services/exchange-rate.service";

@Component({
  selector: "app-exchange-rate-banner",
  standalone: true,
  imports: [CommonModule],
  styles: [
    `
      /* Ocultar spinners del input number */
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
      }
    `,
  ],
  template: `
    <div class="relative flex items-center gap-3">
      <!-- Calculadora de conversión -->
      <div class="flex items-center gap-1.5">
        <input
          type="number"
          min="0"
          step="any"
          [value]="convertAmountStr()"
          (input)="convertAmountStr.set($any($event.target).value)"
          class="w-16 px-2 py-1 rounded-lg text-sm text-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
        />
        <span
          class="text-xs font-semibold text-slate-600 dark:text-slate-300"
          >{{ fromCurrency() }}</span
        >

        <!-- Switch direction -->
        <button
          type="button"
          (click)="toggleDirection()"
          title="Invertir conversión"
          class="px-1.5 py-1 rounded-lg text-slate-500 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-base leading-none"
        >
          ⇄
        </button>

        <span
          class="text-sm font-semibold text-slate-900 dark:text-white tabular-nums"
        >
          {{ convertedResult() | number: "1.2-4" }}
        </span>
        <span
          class="text-xs font-semibold text-slate-600 dark:text-slate-300"
          >{{ toCurrency() }}</span
        >
      </div>

      <!-- Separador -->
      <div class="w-px h-5 bg-slate-200 dark:bg-slate-700"></div>

      <!-- Tasa base + badge manual -->
      <div class="flex items-center gap-1.5">
        <span class="text-xs text-slate-400 dark:text-slate-500 tabular-nums">
          1 EUR = {{ xr.displayRate() }} USD
        </span>
        @if (xr.isManual()) {
          <span
            class="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 font-semibold"
            >Manual</span
          >
          <button
            type="button"
            (click)="clearManualRate()"
            class="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-red-500 dark:text-slate-400 transition-colors"
          >
            Reset
          </button>
        }
        <button
          type="button"
          (click)="toggleManualInput()"
          class="text-xs px-2.5 py-1 rounded-lg transition-colors"
          [class]="
            showManualInput()
              ? 'bg-cyan-500/15 text-cyan-500'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          "
        >
          {{ showManualInput() ? "Cancelar" : "Tasa manual" }}
        </button>
      </div>

      <!-- Panel de tasa manual (dropdown) -->
      @if (showManualInput()) {
        <div
          class="absolute top-full right-0 mt-2 p-3 rounded-xl shadow-xl border z-50
                 bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-700"
        >
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-2">
            1 EUR = ? USD
          </p>
          <div class="flex items-center gap-2">
            <input
              type="number"
              step="0.0001"
              min="0"
              [value]="manualRateInput()"
              (input)="manualRateInput.set($any($event.target).value)"
              placeholder="Ej: 1.0850"
              class="w-24 px-2 py-1.5 rounded-lg text-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
            />
            <span class="text-xs text-slate-400">USD</span>
            <button
              type="button"
              (click)="applyManualRate()"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors"
            >
              Aplicar
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class ExchangeRateBannerComponent {
  readonly xr = inject(ExchangeRateService);

  readonly inverted = signal(false);
  readonly convertAmountStr = signal("1");
  readonly showManualInput = signal(false);
  readonly manualRateInput = signal("");

  readonly fromCurrency = computed(() => (this.inverted() ? "USD" : "EUR"));
  readonly toCurrency = computed(() => (this.inverted() ? "EUR" : "USD"));

  readonly convertedResult = computed(() => {
    const amount = Number.parseFloat(this.convertAmountStr()) || 0;
    const rate = this.xr.rate();
    return this.inverted() ? amount / rate : amount * rate;
  });

  toggleDirection() {
    this.inverted.update((v) => !v);
  }

  toggleManualInput() {
    const next = !this.showManualInput();
    this.showManualInput.set(next);
    if (next) {
      this.manualRateInput.set(this.xr.displayRate());
    } else {
      this.manualRateInput.set("");
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
