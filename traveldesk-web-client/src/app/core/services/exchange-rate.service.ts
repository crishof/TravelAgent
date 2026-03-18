import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, forkJoin, map, of, tap } from "rxjs";
import { environment } from "../../../environments/environment";

const MANUAL_RATE_KEY = "td_exchange_rate_override";
const MANUAL_RATE_PAIR_KEY = "td_exchange_rate_override_pair";

@Injectable({ providedIn: "root" })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/exchange-rate`;
  private readonly usdToEurRate = signal<number>(1.085);
  private readonly eurToUsdRate = signal<number>(1 / 1.085);

  /** Rate obtained from backend API */
  private readonly apiRate = signal<number>(1.085);
  /** Manual override entered by the user (null = use API rate) */
  private readonly manualRate = signal<number | null>(this.loadManualRate());
  private readonly manualPair = signal<{ from: string; to: string } | null>(
    this.loadManualPair(),
  );

  /** Effective rate: manual takes precedence */
  readonly rate = computed(() => this.manualRate() ?? this.apiRate());
  readonly isManual = computed(() => this.manualRate() !== null);
  readonly displayRate = computed(() => this.rate().toFixed(4));

  loadRate() {
    return this.refreshSupportedPairs().pipe(
      tap(({ usdToEur, eurToUsd }) => {
        this.usdToEurRate.set(usdToEur);
        this.eurToUsdRate.set(eurToUsd);
        this.apiRate.set(usdToEur);
      }),
      map(({ usdToEur }) => usdToEur),
      catchError(() => {
        // Fallback to default rate if API fails
        console.warn("Failed to load exchange rate from API, using default");
        this.apiRate.set(1.085);
        this.usdToEurRate.set(1.085);
        this.eurToUsdRate.set(1 / 1.085);
        return of(1.085);
      }),
    );
  }

  fetchRate() {
    return this.loadRate();
  }

  refreshSupportedPairs() {
    return forkJoin({
      usdToEur: this.getPairRate("USD", "EUR"),
      eurToUsd: this.getPairRate("EUR", "USD"),
    });
  }

  getPairRate(from: string, to: string) {
    if (from === to) {
      return of(1);
    }

    return this.http
      .get<number>(this.api, {
        params: { from, to },
      })
      .pipe(
        map((value) => this.parseRate(value)),
        tap((rate) => {
          if (from === "USD" && to === "EUR") {
            this.usdToEurRate.set(rate);
            this.apiRate.set(rate);
          }
          if (from === "EUR" && to === "USD") {
            this.eurToUsdRate.set(rate);
          }
        }),
      );
  }

  getRateForPair(from: string, to: string): number {
    if (from === to) return 1;

    const manualRate = this.manualRate();
    const manualPair = this.manualPair();
    if (manualRate && manualPair) {
      if (manualPair.from === from && manualPair.to === to) {
        return manualRate;
      }
      if (manualPair.from === to && manualPair.to === from) {
        return 1 / manualRate;
      }
    }

    if (from === "USD" && to === "EUR") return this.usdToEurRate();
    if (from === "EUR" && to === "USD") return this.eurToUsdRate();

    return this.apiRate();
  }

  setManualRate(rate: number | null, from?: string, to?: string) {
    this.manualRate.set(rate);
    if (rate === null) {
      localStorage.removeItem(MANUAL_RATE_KEY);
      localStorage.removeItem(MANUAL_RATE_PAIR_KEY);
      this.manualPair.set(null);
    } else {
      localStorage.setItem(MANUAL_RATE_KEY, rate.toString());
      const pair = {
        from: from ?? this.manualPair()?.from ?? "USD",
        to: to ?? this.manualPair()?.to ?? "EUR",
      };
      this.manualPair.set(pair);
      localStorage.setItem(MANUAL_RATE_PAIR_KEY, JSON.stringify(pair));
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

  private loadManualPair(): { from: string; to: string } | null {
    try {
      const raw = localStorage.getItem(MANUAL_RATE_PAIR_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { from?: string; to?: string };
      if (!parsed.from || !parsed.to) return null;
      return { from: parsed.from, to: parsed.to };
    } catch {
      return null;
    }
  }

  private parseRate(raw: number): number {
    return Number.isFinite(raw) && raw > 0 ? raw : 1.085;
  }
}
