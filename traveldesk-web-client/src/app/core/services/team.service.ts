import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  TeamMemberResponse,
  TeamMemberRequest,
  TeamInviteRequest,
} from "../models";

@Injectable({ providedIn: "root" })
export class TeamService {
  private readonly http = inject(HttpClient);
  private readonly api = environment.apiUrl;

  readonly members = signal<TeamMemberResponse[]>([]);

  loadAll() {
    return this.http
      .get<TeamMemberResponse[]>(`${this.api}/api/v1/team`)
      .pipe(tap((data) => this.members.set(data)));
  }

  invite(dto: TeamInviteRequest) {
    return this.http
      .post<TeamMemberResponse>(`${this.api}/api/v1/team/invite`, dto)
      .pipe(tap((member) => this.members.update((list) => [...list, member])));
  }

  update(memberId: string, dto: TeamMemberRequest) {
    return this.http
      .put<TeamMemberResponse>(`${this.api}/api/v1/team/${memberId}`, dto)
      .pipe(
        tap((updated) =>
          this.members.update((list) =>
            list.map((m) => (m.id === updated.id ? updated : m)),
          ),
        ),
      );
  }

  remove(memberId: string) {
    return this.http
      .delete(`${this.api}/api/v1/team/${memberId}`)
      .pipe(
        tap(() =>
          this.members.update((list) => list.filter((m) => m.id !== memberId)),
        ),
      );
  }

  getById(id: string): TeamMemberResponse | undefined {
    return this.members().find((m) => m.id === id);
  }

  getAgents() {
    return computed(() => this.members().filter((m) => m.role === "AGENT"));
  }

  getActiveAgents() {
    return computed(() =>
      this.members().filter((m) => m.role === "AGENT" && m.status === "active"),
    );
  }
}
