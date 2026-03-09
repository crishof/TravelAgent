import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TeamService } from '../../core/services/team.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './team.component.html',
})
export class TeamComponent implements OnInit {
  teamSvc = inject(TeamService);
  auth    = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  showInvite            = signal(false);
  inviteLoading         = signal(false);
  inviteError           = signal('');
  copiedToken           = signal<string | null>(null);
  viewingCommissionsFor = signal<string | null>(null);

  inviteForm = this.fb.group({
    email:         ['', [Validators.required, Validators.email]],
    commissionPct: [10],
  });

  agentCommissions = computed(() => {
    const id = this.viewingCommissionsFor();
    if (!id) return [];
    return this.teamSvc.commissions().filter(c => c.agentId === id);
  });

  commissionSummary = computed(() => {
    const id = this.viewingCommissionsFor();
    if (!id) return [];
    const earned  = this.teamSvc.getTotalEarned(id);
    const paid    = this.teamSvc.getTotalPaid(id);
    const pending = earned - paid;
    return [
      { label: 'Total ganado', value: earned,  color: 'text-emerald-500' },
      { label: 'Cobrado',      value: paid,    color: 'text-blue-400' },
      { label: 'Pendiente',    value: pending, color: 'text-amber-500' },
    ];
  });

  ngOnInit() {
    this.teamSvc.loadUsers().subscribe();
    this.teamSvc.loadCommissions().subscribe();
  }

  sendInvite() {
    if (this.inviteForm.invalid) return;
    this.inviteLoading.set(true);
    this.teamSvc.inviteAgent({
      email:         this.inviteForm.value.email!,
      commissionPct: Number(this.inviteForm.value.commissionPct),
    }).subscribe({
      next: () => { this.showInvite.set(false); this.inviteLoading.set(false); },
      error: (e) => { this.inviteError.set(e?.error?.message || 'Error'); this.inviteLoading.set(false); }
    });
  }

  copyToken(token: string) {
    navigator.clipboard.writeText(`${globalThis.location.origin}/auth/invite/${token}`).catch(() => {});
    this.copiedToken.set(token);
    setTimeout(() => this.copiedToken.set(null), 2000);
  }

  openCommissions(agentId: string) {
    this.viewingCommissionsFor.set(agentId);
  }

  markPaid(commissionId: string) {
    this.teamSvc.markCommissionPaid(commissionId).subscribe();
  }

  getAgentName(id: string): string {
    return this.teamSvc.getById(id)?.fullName ?? '—';
  }
}
