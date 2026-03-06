import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ProvidersService } from "../../core/services/providers.service";
import { ProviderCategory } from "../../core/models";

@Component({
  selector: "app-providers",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./providers.component.html",
})
export class ProvidersComponent implements OnInit {
  providersSvc = inject(ProvidersService);
  private readonly fb = inject(FormBuilder);

  showNew = signal(false);
  categories: ProviderCategory[] = [
    "Hotel",
    "Aéreo",
    "Paquete",
    "Transporte",
    "Crucero",
    "Seguro",
    "Otro",
  ];

  form = this.fb.group({
    name: ["", Validators.required],
    category: ["Hotel", Validators.required],
    country: ["", Validators.required],
    contact: ["", [Validators.required, Validators.email]],
    currency: ["USD", Validators.required],
    notes: [""],
  });

  ngOnInit() {
    this.providersSvc.loadAll().subscribe();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.providersSvc.create(this.form.value as any).subscribe();
    this.showNew.set(false);
    this.form.reset({ category: "Hotel", currency: "USD" });
  }

  catGradient(cat: ProviderCategory): string {
    const map: Partial<Record<ProviderCategory, string>> = {
      Hotel: "bg-gradient-to-br from-sky-500 to-blue-600",
      Aéreo: "bg-gradient-to-br from-cyan-500 to-teal-600",
      Paquete: "bg-gradient-to-br from-emerald-500 to-green-600",
      Transporte: "bg-gradient-to-br from-amber-500 to-orange-600",
      Crucero: "bg-gradient-to-br from-violet-500 to-purple-600",
      Seguro: "bg-gradient-to-br from-rose-500 to-pink-600",
      Otro: "bg-gradient-to-br from-slate-500 to-slate-600",
    };
    return map[cat] ?? map["Otro"]!;
  }
}
