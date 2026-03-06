import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, of, tap } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class ExchangeRateService {
  private readonly http = inject(HttpClient);

  /** Rate obtained from external API */
  private readonly apiRate = signal<number>(1.085);
  /** Manual override entered by the user (null = use API rate) */
  private readonly manualRate = signal<number | null>(null);

  /** Effective rate: manual takes precedence */
  readonly rate = computed(() => this.manualRate() ?? this.apiRate());
  readonly isManual = computed(() => this.manualRate() !== null);
  readonly displayRate = computed(() => this.rate().toFixed(4));

  fetchRate() {
    return this.http
      .get<{ rates: { EUR: number } }>(environment.exchangeRateApiUrl)
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
  }

  clearManual() {
    this.manualRate.set(null);
  }
}
