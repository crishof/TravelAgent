import { Injectable, computed, signal } from "@angular/core";
import { VisibilityMode } from "../models";

@Injectable({ providedIn: "root" })
export class VisibilityModeService {
  private readonly modeState = signal<VisibilityMode>("MY_DATA");

  readonly mode = computed(() => this.modeState());
  readonly isAllUsers = computed(() => this.modeState() === "ALL_USERS");

  setMode(mode: VisibilityMode) {
    this.modeState.set(mode);
  }

  toggle() {
    this.modeState.update((current) =>
      current === "MY_DATA" ? "ALL_USERS" : "MY_DATA",
    );
  }
}
