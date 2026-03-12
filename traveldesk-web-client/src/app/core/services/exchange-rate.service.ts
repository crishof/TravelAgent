import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, of, tap } from "rxjs";
import { environment } from "../../../environments/environment";

const MANUAL_RATE_KEY = "td_exchange_rate_override";

@Injectable({ providedIn: "root" })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/exchange-rate`;

  /** Rate obtained from backend API */
  private readonly apiRate = signal<number>(1.085);
  /** Manual override entered by the user (null = use API rate) */
  private readonly manualRate = signal<number | null>(this.loadManualRate());

  /** Effective rate: manual takes precedence */
  readonly rate = computed(() => this.manualRate() ?? this.apiRate());
  readonly isManual = computed(() => this.manualRate() !== null);
  readonly displayRate = computed(() => this.rate().toFixed(4));

  loadRate() {
    return this.getPairRate("USD", "EUR").pipe(
      tap((rate) => this.apiRate.set(rate)),
      catchError(() => {
        // Fallback to default rate if API fails
        console.warn("Failed to load exchange rate from API, using default");
        this.apiRate.set(1.085);
        return of(1.085);
      }),
    );
  }

  fetchRate() {
    return this.loadRate();
  }

  getPairRate(from: string, to: string) {
    return this.http
      .get<number>(this.api, {
        params: { from, to },
      })
      .pipe(map((value) => this.parseRate(value)));
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

  private parseRate(raw: number): number {
    return Number.isFinite(raw) && raw > 0 ? raw : 1.085;
  }
}
