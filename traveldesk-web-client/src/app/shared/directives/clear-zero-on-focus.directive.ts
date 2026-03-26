import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appClearZeroOnFocus]",
  standalone: true,
})
export class ClearZeroOnFocusDirective {
  constructor(private readonly elementRef: ElementRef<HTMLInputElement>) {}

  @HostListener("focus")
  onFocus() {
    const input = this.elementRef.nativeElement;
    if (input.type !== "number") return;

    const rawValue = input.value.trim();

    if (!rawValue) return;

    const numericValue = Number(rawValue);
    if (!Number.isFinite(numericValue) || numericValue !== 0) return;

    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }
}
