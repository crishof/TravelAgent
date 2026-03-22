import { Injectable, inject, signal, computed } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { finalize, of, tap, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  AcceptInviteRequest,
  AuthMeResponse,
  SignupResponse,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  MessageResponse,
  RefreshTokenRequest,
} from "../models";

const TOKEN_KEY = "td_token";
const REFRESH_KEY = "td_refresh";
const USER_KEY = "td_user";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly api = environment.apiUrl;

  // ── Signals ──────────────────────────────────────────────────────────────
  readonly currentUser = signal<AuthMeResponse | null>(this.loadUser());
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  readonly refreshToken = signal<string | null>(localStorage.getItem(REFRESH_KEY));

  readonly isLoggedIn = computed(() => !!this.token() && !!this.currentUser());
  readonly isAdmin = computed(() => this.currentUser()?.role === "ADMIN");

  // ── Auth actions ─────────────────────────────────────────────────────────
  login(dto: LoginRequest) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/login`, dto)
      .pipe(tap((res) => this.storeSession(res)));
  }

  register(dto: SignupRequest) {
    return this.http.post<SignupResponse>(`${this.api}/auth/signup`, dto);
  }

  acceptInvite(dto: AcceptInviteRequest) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/accept-invite`, dto)
      .pipe(tap((res) => this.storeSession(res)));
  }

  verifyEmail(dto: VerifyEmailRequest) {
    return this.http
      .post<AuthResponse>(`${this.api}/auth/verify-email`, dto)
      .pipe(tap((res) => this.storeSession(res)));
  }

  forgotPassword(dto: ForgotPasswordRequest) {
    return this.http.post<MessageResponse>(`${this.api}/auth/forgot-password`, dto);
  }

  resetPassword(dto: ResetPasswordRequest) {
    return this.http.post<MessageResponse>(`${this.api}/auth/reset-password`, dto);
  }

  getInviteInfo(token: string) {
    return this.http.get<{ email: string; agencyName: string }>(
      `${this.api}/auth/invite-info/${token}`,
    );
  }

  refresh() {
    const rt = this.refreshToken();
    if (!rt) {
      this.clearSession();
      return throwError(() => new Error('No refresh token'));
    }
    const payload: RefreshTokenRequest = { refreshToken: rt };

    return this.http
      .post<AuthResponse>(`${this.api}/auth/refresh`, payload)
      .pipe(tap((res) => this.storeSession(res)));
  }

  logout() {
    const rt = this.refreshToken();
    if (!rt) {
      this.clearSession();
      return of({ message: "Logout successful" });
    }

    return this.http
      .post<MessageResponse>(`${this.api}/auth/logout`, { refreshToken: rt })
      .pipe(finalize(() => this.clearSession()));
  }

  logoutAll() {
    return this.http
      .post<MessageResponse>(`${this.api}/auth/logout-all`, null)
      .pipe(finalize(() => this.clearSession()));
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

    if (res.refreshToken) {
      localStorage.setItem(REFRESH_KEY, res.refreshToken);
      this.refreshToken.set(res.refreshToken);
    }

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
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
    this.token.set(null);
    this.refreshToken.set(null);
    this.currentUser.set(null);
    this.router.navigate(["/auth/login"]);
  }

  private loadUser(): AuthMeResponse | null {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as AuthMeResponse;
    } catch {
      // Prevent app bootstrap crashes when stale/corrupted session data exists.
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_KEY);
      return null;
    }
  }
}
