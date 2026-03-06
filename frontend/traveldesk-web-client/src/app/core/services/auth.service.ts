import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  AuthResponse,
  LoginDto,
  CreateAgencyDto,
  AcceptInviteDto,
  User,
  Agency,
} from "../models";

const TOKEN_KEY = "td_token";
const USER_KEY = "td_user";
const AGENCY_KEY = "td_agency";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly api = environment.apiUrl;

  // ── Signals ──────────────────────────────────────────────────────────────
  readonly currentUser = signal<User | null>(this.loadUser());
  readonly currentAgency = signal<Agency | null>(this.loadAgency());
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly isLoggedIn = computed(() => !!this.token() && !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === "ADMIN");
  readonly isAgent = computed(() => this.currentUser()?.role === "AGENT");

  // ── Auth actions ─────────────────────────────────────────────────────────
  login(dto: LoginDto) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/login`, dto)
      .pipe(tap((res) => this.storeSession(res)));
  }

  registerAgency(dto: CreateAgencyDto) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/register`, dto)
      .pipe(tap((res) => this.storeSession(res)));
  }

  acceptInvite(dto: AcceptInviteDto) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/accept-invite`, dto)
      .pipe(tap((res) => this.storeSession(res)));
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(AGENCY_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.currentAgency.set(null);
    this.router.navigate(["/auth/login"]);
  }

  // ── Invite ────────────────────────────────────────────────────────────────
  getInviteInfo(token: string) {
    return this.http.get<{ email: string; agency: Agency }>(
      `${this.api}/auth/invite/${token}`,
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private storeSession(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(USER_KEY, JSON.stringify(res.user));
    localStorage.setItem(AGENCY_KEY, JSON.stringify(res.agency));
    this.token.set(res.token);
    this.currentUser.set(res.user);
    this.currentAgency.set(res.agency);
  }

  private loadUser(): User | null {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || "null");
    } catch {
      return null;
    }
  }

  private loadAgency(): Agency | null {
    try {
      return JSON.parse(localStorage.getItem(AGENCY_KEY) || "null");
    } catch {
      return null;
    }
  }
}
