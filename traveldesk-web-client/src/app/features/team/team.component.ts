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
  inviteLoading = signal(false);
  inviteError = signal("");
  copiedToken = signal<string | null>(null);

  inviteForm = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    role: ["AGENT", [Validators.required]],
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
          this.showInvite.set(false);
          this.inviteLoading.set(false);
        },
        error: (e) => {
          this.inviteError.set(e?.error?.message || "Error");
          this.inviteLoading.set(false);
        },
      });
  }

  copyToken(token: string) {
    navigator.clipboard
      .writeText(`${globalThis.location.origin}/auth/invite/${token}`)
      .catch(() => {});
    this.copiedToken.set(token);
    setTimeout(() => this.copiedToken.set(null), 2000);
  }

  getAgentName(id: string): string {
    return this.teamSvc.getById(id)?.fullName ?? "—";
  }
}
