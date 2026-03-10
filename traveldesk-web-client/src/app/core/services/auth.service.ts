import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  AcceptInviteRequest,
  AuthMeResponse,
} from "../models";

const TOKEN_KEY = "td_token";
const USER_KEY = "td_user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly api = environment.apiUrl;

  // ── Signals ──────────────────────────────────────────────────────────────
  readonly currentUser = signal<AuthMeResponse | null>(this.loadUser());
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  readonly isLoggedIn = computed(() => !!this.token() && !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === "ADMIN");

  // ── Auth actions ─────────────────────────────────────────────────────────
  login(dto: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/login`, dto)
      .pipe(tap((res) => this.storeSession(res)));
  }

  register(dto: SignupRequest) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/signup`, dto)
      .pipe(tap((res) => this.storeSession(res)));
  }

  acceptInvite(dto: AcceptInviteRequest) {
    return this.http.post<any>(`${this.api}/auth/accept-invite`, dto).pipe(
      tap((res) => {
        if (res.accessToken) {
          this.storeSession(res);
        }
      }),
    );
  }

  getInviteInfo(token: string) {
    return this.http.get<{ email: string; agencyName: string }>(
      `${this.api}/auth/invite-info/${token}`,
    );
  }

  logout() {
    this.clearSession();
  }

  getCurrentUser() {
    return this.http.get<AuthMeResponse>(`${this.api}/auth/me`).pipe(
      tap((user) => {
        this.currentUser.set(user);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }),
    );
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private storeSession(res: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    this.token.set(res.accessToken);

    // Store basic user info from response
    const userInfo: AuthMeResponse = {
      id: res.userId,
      email: res.email,
      fullName: res.fullName,
      role: res.role,
      status: res.status,
    };
    this.currentUser.set(userInfo);
    localStorage.setItem(USER_KEY, JSON.stringify(userInfo));
  }

  private clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.currentUser.set(null);
    this.router.navigate(["/auth/login"]);
  }

  private loadUser(): AuthMeResponse | null {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
}
