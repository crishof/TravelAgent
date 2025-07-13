import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { RegisterRequest } from '../model/registerRequest';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly _urlBase = `${environment.apiUrl}/auth`;
  readonly _http = inject(HttpClient);

  constructor() {}

  register(request: RegisterRequest): Observable<any> {
    return this._http.post(`${this._urlBase}/register`, request).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this._http.post(`${this._urlBase}/authenticate`, credentials);
  }

  isLoggedIn(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    // sessionStorage.removeItem('token');
  }
}
