import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { forkJoin } from "rxjs";
import {
  AccountStatementMovement,
  AccountStatementResponse,
  Currency,
} from "../../../core/models";
import { AccountService } from "../../../core/services/account.service";
import { ClearZeroOnFocusDirective } from "../../../shared/directives/clear-zero-on-focus.directive";

@Component({
  selector: "app-account-statement",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ClearZeroOnFocusDirective],
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
  readonly showDeletePaymentDialog = signal(false);
  readonly editingPaymentId = signal<string | null>(null);
  readonly paymentIdToDelete = signal<string | null>(null);
  readonly savingPayment = signal(false);
  readonly deletingPayment = signal(false);

  readonly paymentForm = this.fb.group({
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    currency: ["USD" as Currency, Validators.required],
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
    const paymentId = this.editingPaymentId();

    if (this.paymentForm.invalid || this.savingPayment()) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.savingPayment.set(true);

    const dto = {
      date: this.paymentForm.value.date ?? new Date().toISOString().slice(0, 10),
      amount: Number(this.paymentForm.value.amount),
      currency: this.paymentForm.value.currency as Currency,
    };

    const request$ = paymentId
      ? this.accountSvc.updateAccountPayment(paymentId, dto)
      : this.accountSvc.addAccountPayment(dto);

    request$.subscribe({
      next: () => {
        this.savingPayment.set(false);
        this.closePaymentModal();
        this.loadStatements();
      },
      error: (err) => {
        this.error.set(
          err?.error?.message ??
            (paymentId
              ? "No se pudo actualizar el pago manual"
              : "No se pudo registrar el pago manual"),
        );
        this.savingPayment.set(false);
      },
    });
  }

  openAddPayment() {
    this.editingPaymentId.set(null);
    this.showAddPayment.set(true);
    this.paymentForm.reset({
      date: new Date().toISOString().slice(0, 10),
      amount: null,
      currency: "USD",
    });
  }

  openEditPayment(movement: AccountStatementMovement) {
    this.editingPaymentId.set(movement.id);
    this.showAddPayment.set(true);
    this.paymentForm.reset({
      date: movement.date,
      amount: Math.abs(Number(movement.amount ?? 0)),
      currency: movement.currency ?? "USD",
    });
  }

  closePaymentModal() {
    if (this.savingPayment()) return;
    this.showAddPayment.set(false);
    this.editingPaymentId.set(null);
    this.paymentForm.reset({
      date: new Date().toISOString().slice(0, 10),
      amount: null,
      currency: "USD",
    });
  }

  openDeletePaymentDialog(movement: AccountStatementMovement) {
    this.paymentIdToDelete.set(movement.id);
    this.showDeletePaymentDialog.set(true);
  }

  closeDeletePaymentDialog() {
    if (this.deletingPayment()) return;
    this.showDeletePaymentDialog.set(false);
    this.paymentIdToDelete.set(null);
  }

  confirmDeletePayment() {
    const paymentId = this.paymentIdToDelete();
    if (!paymentId || this.deletingPayment()) return;

    this.deletingPayment.set(true);
    this.accountSvc.deleteAccountPayment(paymentId).subscribe({
      next: () => {
        this.deletingPayment.set(false);
        this.closeDeletePaymentDialog();
        this.loadStatements();
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? "No se pudo eliminar el pago manual");
        this.deletingPayment.set(false);
      },
    });
  }

  isManualPayment(movement: AccountStatementMovement): boolean {
    return movement.type === "MANUAL_PAYMENT";
  }

  formatAmount(amount: number, currency?: string | null) {
    const safeCurrency = currency === "USD" || currency === "EUR" ? currency : "USD";

    return `${safeCurrency} ${Number(amount ?? 0).toFixed(2)}`;
  }

  trackMovement(index: number, movement: { id?: string; date: string; concept: string }) {
    return movement.id ?? `${movement.date}-${movement.concept}-${index}`;
  }
}