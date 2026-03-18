import { Injectable, computed, signal } from "@angular/core";
import { Currency } from "../models";

@Injectable({ providedIn: "root" })
export class DisplayCurrencyService {
  private readonly currencyState = signal<Currency>("USD");

  readonly currency = computed(() => this.currencyState());

  setCurrency(currency: Currency) {
    this.currencyState.set(currency);
  }

  toggle() {
    this.currencyState.update((current) => (current === "USD" ? "EUR" : "USD"));
  }
}
