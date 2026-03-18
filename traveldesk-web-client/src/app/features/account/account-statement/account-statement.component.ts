import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { forkJoin } from "rxjs";
import { AccountStatementResponse, Currency } from "../../../core/models";
import { AccountService } from "../../../core/services/account.service";

@Component({
  selector: "app-account-statement",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./account-statement.component.html",
})
export class AccountStatementComponent implements OnInit {
  private readonly accountSvc = inject(AccountService);
  private readonly fb = inject(FormBuilder);

  readonly currencies: Currency[] = ["USD", "EUR"];

  readonly loading = signal(false);
  readonly error = signal("");
  readonly statements = signal<Record<Currency, AccountStatementResponse | null>>({
    USD: null,
    EUR: null,
  });
  readonly showAddPayment = signal(false);

  readonly paymentForm = this.fb.group({
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    currency: ["USD", Validators.required],
  });

  ngOnInit() {
    this.loadStatements();
  }

  loadStatements() {
    this.loading.set(true);
    this.error.set("");

    forkJoin({
      USD: this.accountSvc.getAccountStatement("USD"),
      EUR: this.accountSvc.getAccountStatement("EUR"),
    }).subscribe({
      next: (statement) => {
        this.statements.set(statement);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? "No se pudo cargar el estado de cuenta");
        this.loading.set(false);
      },
    });
  }

  statementFor(currency: Currency) {
    return this.statements()[currency];
  }

  addPayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.accountSvc
      .addAccountPayment({
        date: this.paymentForm.value.date ?? new Date().toISOString().slice(0, 10),
        amount: Number(this.paymentForm.value.amount),
        currency: this.paymentForm.value.currency as Currency,
      })
      .subscribe({
        next: (statement) => {
          this.statements.update((current) => ({
            ...current,
            [statement.currency]: statement,
          }));
          this.showAddPayment.set(false);
          this.paymentForm.reset({
            date: new Date().toISOString().slice(0, 10),
            amount: null,
            currency: this.paymentForm.value.currency ?? statement.currency,
          });
        },
        error: (err) => {
          this.error.set(err?.error?.message ?? "No se pudo registrar el pago manual");
        },
      });
  }

  formatAmount(amount: number, currency?: string | null) {
    const safeCurrency = currency === "USD" || currency === "EUR" ? currency : "USD";

    return `${safeCurrency} ${Number(amount ?? 0).toFixed(2)}`;
  }

  trackMovement(index: number, movement: { id?: string; date: string; concept: string }) {
    return movement.id ?? `${movement.date}-${movement.concept}-${index}`;
  }
}