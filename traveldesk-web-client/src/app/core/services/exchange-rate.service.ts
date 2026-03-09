import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, of, tap } from "rxjs";
import { environment } from "../../../environments/environment";

const MANUAL_RATE_KEY = "td_exchange_rate_override";

@Injectable({ providedIn: "root" })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);

  /** Rate obtained from external API */
  private readonly apiRate = signal<number>(1.085);
  /** Manual override entered by the user (null = use API rate) */
  private readonly manualRate = signal<number | null>(this.loadManualRate());

  /** Effective rate: manual takes precedence */
  readonly rate = computed(() => this.manualRate() ?? this.apiRate());
  readonly isManual = computed(() => this.manualRate() !== null);
  readonly displayRate = computed(() => this.rate().toFixed(4));

  fetchRate() {
    return this.http
      .get<{ rates: { EUR: number } }>(environment.apiUrl + "/exchange-rate")
      .pipe(
        tap((res) => this.apiRate.set(res.rates["EUR"])),
        catchError(() => {
          console.warn("Exchange rate API unavailable, using fallback");
          return of(null);
        }),
      );
  }

  setManualRate(rate: number | null) {
    this.manualRate.set(rate);
    if (rate === null) {
      localStorage.removeItem(MANUAL_RATE_KEY);
    } else {
      localStorage.setItem(MANUAL_RATE_KEY, rate.toString());
    }
  }

  clearManual() {
    this.setManualRate(null);
  }

  private loadManualRate(): number | null {
    try {
      const stored = localStorage.getItem(MANUAL_RATE_KEY);
      return stored ? Number.parseFloat(stored) : null;
    } catch {
      return null;
    }
  }
}
