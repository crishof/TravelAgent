import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { ClientsService } from "../../core/services/clients.service";
import { SalesService } from "../../core/services/sales.service";

@Component({
  selector: "app-clients",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./clients.component.html",
})
export class ClientsComponent implements OnInit {
  clientsSvc = inject(ClientsService);
  salesSvc = inject(SalesService);
  private readonly fb = inject(FormBuilder);

  showNew = signal(false);
  search = signal("");

  filtered = computed(() =>
    this.clientsSvc
      .clients()
      .filter(
        (c) =>
          !this.search() ||
          c.fullName.toLowerCase().includes(this.search().toLowerCase()) ||
          c.email.toLowerCase().includes(this.search().toLowerCase()),
      ),
  );

  form = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    phone: [""],
    passport: [""],
    nationality: [""],
    notes: [""],
  });

  fields = [
    {
      name: "name",
      label: "Nombre completo",
      type: "text",
      placeholder: "Juan Pérez",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "juan@email.com",
    },
    {
      name: "phone",
      label: "Teléfono",
      type: "text",
      placeholder: "+54 11 0000-0000",
    },
    {
      name: "passport",
      label: "N° Pasaporte",
      type: "text",
      placeholder: "AAB123456",
    },
    {
      name: "nationality",
      label: "Nacionalidad",
      type: "text",
      placeholder: "Argentina",
    },
  ];

  ngOnInit() {
    this.clientsSvc.loadAll().subscribe();
    this.salesSvc.loadAll().subscribe();
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.clientsSvc.create(this.form.value as any).subscribe();
    this.showNew.set(false);
    this.form.reset();
  }

  getSaleCount(clientId: string): number {
    return this.salesSvc.sales().filter((s) => s.customerId === clientId)
      .length;
  }

  getVal(e: Event): string {
    return (e.target as HTMLInputElement).value;
  }
}
