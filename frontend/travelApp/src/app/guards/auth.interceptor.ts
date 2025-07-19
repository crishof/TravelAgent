import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // 🔁 Evitar interceptar la propia petición de refresh
  if (req.url.includes('/auth/refresh')) {
    return next(req);
  }

  const token = authService.getAccessToken();

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(req).pipe(
    catchError((err) => {
      const refreshToken = authService.getRefreshToken();

      if ((err.status === 401 || err.status === 403) && refreshToken) {
        // Intentar renovar el token
        return authService.refreshToken().pipe(
          switchMap((res) => {
            authService.setTokens(res.token, res.refreshToken);

            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${res.token}` },
            });

            return next(retryReq);
          }),
          catchError((refreshErr) => {
            authService.logout(); // Limpia y redirige
            return throwError(() => refreshErr);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
