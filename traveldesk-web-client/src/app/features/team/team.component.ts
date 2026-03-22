import { Component, inject, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { TeamService } from "../../core/services/team.service";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-team",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./team.component.html",
})
export class TeamComponent implements OnInit {
  teamSvc = inject(TeamService);
  auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  showInvite = signal(false);
  showCommissionModal = signal(false);
  inviteLoading = signal(false);
  inviteError = signal("");
  selectedMemberId = signal<string | null>(null);

  inviteForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    role: ["AGENT", [Validators.required]],
  });

  commissionForm = this.fb.group({
    commissionPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
  });

  ngOnInit() {
    this.teamSvc.loadAll().subscribe();
  }

  sendInvite() {
    if (this.inviteForm.invalid) return;
    this.inviteLoading.set(true);
    this.teamSvc
      .invite({
        email: this.inviteForm.value.email!,
        role: this.inviteForm.value.role!,
      })
      .subscribe({
        next: () => {
          this.teamSvc.loadAll().subscribe();
          this.showInvite.set(false);
          this.inviteError.set("");
          this.inviteLoading.set(false);
        },
        error: (e) => {
          this.inviteError.set(e?.error?.message || "Error");
          this.inviteLoading.set(false);
        },
      });
  }

  getAgentName(id: string): string {
    return this.teamSvc.getById(id)?.fullName ?? "—";
  }

  openCommissionModal(memberId: string, currentCommission?: number) {
    this.selectedMemberId.set(memberId);
    this.commissionForm.patchValue({ commissionPercentage: currentCommission ?? 0 });
    this.showCommissionModal.set(true);
  }

  saveCommission() {
    const memberId = this.selectedMemberId();
    if (!memberId || this.commissionForm.invalid) {
      this.commissionForm.markAllAsTouched();
      return;
    }

    this.teamSvc
      .updateCommission(memberId, Number(this.commissionForm.value.commissionPercentage ?? 0))
      .subscribe({
        next: () => this.showCommissionModal.set(false),
        error: (err) => console.error("Error updating commission:", err),
      });
  }
}
