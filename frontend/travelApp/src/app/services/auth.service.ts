import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../model/registerRequest';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly _urlBase = `${environment.apiUrl}/auth`;
  readonly _http = inject(HttpClient);
  readonly _router = inject(Router);

  constructor() {}

  register(request: RegisterRequest): Observable<any> {
    return this._http.post(`${this._urlBase}/register`, request).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this._http.post(`${this._urlBase}/authenticate`, credentials).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  logout() {
    console.log('🚪 Cerrando sesión. Limpiando tokens...');
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');
      localStorage.setItem('sessionExpired', 'true');
    }
    this._router.navigate(['/login']);
  }

  setTokens(token: string, refreshToken: string): void {
    console.log('🔄 Guardando nuevos tokens');
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  getAccessToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  getRefreshToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('refreshToken') : null;
  }

  // ✅ Llama al backend para renovar el token
  refreshToken(): Observable<{ token: string; refreshToken: string }> {
    const refreshToken = this.getRefreshToken();
    return this._http.post<{ token: string; refreshToken: string }>(
      `${this._urlBase}/refresh`,
      { refreshToken }
    );
  }

  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
