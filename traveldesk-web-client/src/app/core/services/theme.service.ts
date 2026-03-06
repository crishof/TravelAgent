import { Injectable, signal, computed } from "@angular/core";

@Injectable({ providedIn: "root" })
export class ThemeService {
  private readonly _isDark = signal<boolean>(this.loadPreference());
  readonly isDark = computed(() => this._isDark());

  constructor() {
    // Apply initial theme
    this.applyTheme(this._isDark());
  }

  toggle() {
    this._isDark.update((current) => {
      const newValue = !current;
      this.applyTheme(newValue);
      return newValue;
    });
  }

  private applyTheme(dark: boolean) {
    // Access document safely for SSR compatibility
    if (typeof document !== "undefined") {
      const htmlEl = document.documentElement;
      if (dark) {
        htmlEl.classList.add("dark");
      } else {
        htmlEl.classList.remove("dark");
      }
    }
    // Persist preference
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("td_theme", dark ? "dark" : "light");
    }
  }

  private loadPreference(): boolean {
    if (typeof localStorage === "undefined") return false;
    const saved = localStorage.getItem("td_theme");
    if (saved) return saved === "dark";
    // Fall back to system preference
    if (typeof globalThis !== "undefined" && globalThis.matchMedia) {
      return globalThis.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  }
}
