import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../model/registerRequest';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly _urlBase = `${environment.apiUrl}/auth`;
  readonly _http = inject(HttpClient);
  readonly _router = inject(Router);
  readonly _sessionService = inject(SessionService);

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

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
    const token = this.getAccessToken();
    return !!token && token !== 'undefined' && token !== 'null';
  }

  logout() {    

    if (this.isBrowser()) {
      // ✅ Limpieza de tokens primero
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('refreshToken');

      // ✅ Estado de login en falso
      this.isLoggedInSubject.next(false);

      // ✅ Notificación de sesión expirada
      this._sessionService.notifySessionExpired();
    }

    // ✅ Redirección
    this._router.navigate(['/login']);
  }

  setTokens(token: string, refreshToken: string): void {    
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      this.isLoggedInSubject.next(true); // 👈 notifica
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

  private hasToken(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }
}
