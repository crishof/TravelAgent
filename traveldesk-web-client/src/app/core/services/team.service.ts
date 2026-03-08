import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import { User, Commission, InviteAgentDto } from "../models";

@Injectable({ providedIn: "root" })
export class TeamService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  readonly users = signal<User[]>([]);
  readonly commissions = signal<Commission[]>([]);

  // ── Users ─────────────────────────────────────────────────────────────────
  loadUsers() {
    return this.http
      .get<User[]>(`${this.api}/team`)
      .pipe(tap((data) => this.users.set(data)));
  }

  inviteAgent(dto: InviteAgentDto) {
    return this.http
      .post<User>(`${this.api}/team/invite`, dto)
      .pipe(tap((user) => this.users.update((list) => [...list, user])));
  }

  updateCommissionRate(userId: string, commissionPct: number) {
    return this.http
      .patch<User>(`${this.api}/team/${userId}`, { commissionPct })
      .pipe(
        tap((updated) =>
          this.users.update((list) =>
            list.map((u) => (u.id === updated.id ? updated : u)),
          ),
        ),
      );
  }

  removeUser(userId: string) {
    return this.http
      .delete(`${this.api}/team/${userId}`)
      .pipe(
        tap(() =>
          this.users.update((list) => list.filter((u) => u.id !== userId)),
        ),
      );
  }

  getById(id: string): User | undefined {
    return this.users().find((u) => u.id === id);
  }

  getAgents() {
    return computed(() => this.users().filter((u) => u.role === "AGENT"));
  }

  getActiveAgents() {
    return computed(() =>
      this.users().filter((u) => u.role === "AGENT" && u.status === "active"),
    );
  }

  // ── Commissions ───────────────────────────────────────────────────────────
  loadCommissions(agentId?: string) {
    const url = agentId
      ? `${this.api}/commissions?agentId=${agentId}`
      : `${this.api}/commissions`;
    return this.http
      .get<Commission[]>(url)
      .pipe(tap((data) => this.commissions.set(data)));
  }

  markCommissionPaid(id: string) {
    return this.http
      .patch<Commission>(`${this.api}/commissions/${id}/pay`, {})
      .pipe(
        tap((updated) =>
          this.commissions.update((list) =>
            list.map((c) => (c.id === id ? updated : c)),
          ),
        ),
      );
  }

  getCommissionsForAgent(agentId: string) {
    return computed(() =>
      this.commissions().filter((c) => c.agentId === agentId),
    );
  }

  getTotalEarned(agentId: string): number {
    return this.commissions()
      .filter((c) => c.agentId === agentId)
      .reduce((a, c) => a + c.amount, 0);
  }

  getTotalPaid(agentId: string): number {
    return this.commissions()
      .filter((c) => c.agentId === agentId && c.status === "Pagado")
      .reduce((a, c) => a + c.amount, 0);
  }

  getPending(agentId: string): number {
    return this.getTotalEarned(agentId) - this.getTotalPaid(agentId);
  }
}
