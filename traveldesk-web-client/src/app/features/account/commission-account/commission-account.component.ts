import { Component, inject, signal, computed, OnInit } from "@angular/core";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { TeamService } from "../../../core/services/team.service";
import { AuthService } from "../../../core/services/auth.service";

interface CommissionPaymentHistory {
  id: string;
  amount: number;
  paymentDate: string;
  reference?: string;
  notes?: string;
}

@Component({
  selector: "app-commission-account",
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule],
  templateUrl: "./commission-account.component.html",
})
export class CommissionAccountComponent implements OnInit {
  teamSvc = inject(TeamService);
  auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  showPaymentForm = signal(false);
  isRegistering = signal(false);
  paymentHistory = signal<CommissionPaymentHistory[]>([]);

  user = this.auth.currentUser;

  myCommissions = computed(() =>
    this.teamSvc.commissions().filter((c) => c.agentId === this.user()?.id),
  );

  commissionSummary = computed(() => {
    const commissions = this.myCommissions();
    const payments = this.paymentHistory();

    const totalEarned = commissions.reduce((sum, c) => sum + c.amount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalEarned,
      totalPaid,
      pendingPayment: totalEarned - totalPaid,
    };
  });

  paymentForm = this.fb.group({
    amount: ["", [Validators.required, Validators.min(0.01)]],
    paymentDate: [new Date().toISOString().split("T")[0], Validators.required],
    reference: [""],
    notes: [""],
  });

  ngOnInit() {
    this.teamSvc.loadCommissions(this.user()?.id).subscribe();
    // TODO: Cargar historial de pagos del backend
    this.loadPaymentHistory();
  }

  private loadPaymentHistory() {
    // Datos de ejemplo - reemplazar con llamada al backend
    const mockHistory: CommissionPaymentHistory[] = [
      {
        id: "p1",
        amount: 500,
        paymentDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        reference: "Transferencia #TRX-001",
        notes: "Pago mensual",
      },
      {
        id: "p2",
        amount: 750.5,
        paymentDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        reference: "Transferencia #TRX-002",
        notes: "Pago especial",
      },
    ];
    this.paymentHistory.set(mockHistory);
  }

  togglePaymentForm() {
    this.showPaymentForm.update((v) => !v);
    if (!this.showPaymentForm()) {
      this.resetPaymentForm();
    }
  }

  registerPayment() {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    this.isRegistering.set(true);

    const rawAmount = this.paymentForm.get("amount")?.value || 0;
    const newPayment: CommissionPaymentHistory = {
      id: `p${Date.now()}`,
      amount:
        typeof rawAmount === "string"
          ? Number.parseFloat(rawAmount)
          : rawAmount,
      paymentDate: this.paymentForm.get("paymentDate")?.value || "",
      reference: this.paymentForm.get("reference")?.value || undefined,
      notes: this.paymentForm.get("notes")?.value || undefined,
    };

    // Simular llamada a API
    setTimeout(() => {
      this.paymentHistory.update((history) => [newPayment, ...history]);
      this.showPaymentForm.set(false);
      this.resetPaymentForm();
      this.isRegistering.set(false);
      // TODO: Implementar llamada real a backend
      console.log("Pago registrado:", newPayment);
    }, 500);
  }

  private resetPaymentForm() {
    this.paymentForm.reset({
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      reference: "",
      notes: "",
    });
  }
}
