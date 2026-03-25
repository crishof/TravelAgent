import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpContextToken,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { environment } from "../../../environments/environment";

const REFRESH_RETRIED = new HttpContextToken<boolean>(() => false);

function isSoftFailureEndpoint(url: string): boolean {
  return url.includes('/exchange-rate');
}

function isPublicGuestEndpoint(url: string): boolean {
  return (
    url.includes('/auth/invite-info') ||
    url.includes('/auth/accept-invite') ||
    url.includes('/auth/login') ||
    url.includes('/auth/signup') ||
    url.includes('/auth/forgot-password') ||
    url.includes('/auth/reset-password') ||
    url.includes('/auth/verify-email')
  );
}

function debugAuthTrace(event: string, data?: Record<string, unknown>) {
  if (environment.production) return;
  console.debug("[auth-trace]", event, data ?? {});
}

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();
  const alreadyRetried = req.context.get(REFRESH_RETRIED);
  const softFailureEndpoint = isSoftFailureEndpoint(req.url);
  const publicGuestEndpoint = isPublicGuestEndpoint(req.url);

  debugAuthTrace("request", {
    method: req.method,
    url: req.url,
    hasToken: Boolean(token),
    alreadyRetried,
    softFailureEndpoint,
    publicGuestEndpoint,
  });

  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {
      const isRefreshCall = req.url.includes('/auth/refresh');

      debugAuthTrace("error", {
        method: req.method,
        url: req.url,
        status: err.status,
        isRefreshCall,
        alreadyRetried,
        softFailureEndpoint,
        publicGuestEndpoint,
      });

      if (err.status === 401 && publicGuestEndpoint) {
        debugAuthTrace("skip-session-invalidation", {
          reason: "public-guest-endpoint",
          url: req.url,
        });
        return throwError(() => err);
      }

      if (err.status === 401 && softFailureEndpoint) {
        debugAuthTrace("skip-session-invalidation", {
          reason: "soft-failure-endpoint",
          url: req.url,
        });
        return throwError(() => err);
      }

      if (err.status === 401 && !isRefreshCall && !alreadyRetried) {
        debugAuthTrace("refresh-start", { url: req.url });
        return auth.refresh().pipe(
          switchMap(() => {
            const newToken = auth.token();
            if (!newToken) {
              debugAuthTrace("refresh-no-token", { url: req.url });
              auth.handleUnauthorized();
              return throwError(() => err);
            }

            debugAuthTrace("refresh-success", { url: req.url });

            const retried = req.clone({
              context: req.context.set(REFRESH_RETRIED, true),
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });
            return next(retried);
          }),
          catchError((refreshErr) => {
            debugAuthTrace("refresh-error", {
              url: req.url,
              status:
                refreshErr instanceof HttpErrorResponse
                  ? refreshErr.status
                  : "unknown",
            });

            if (
              refreshErr instanceof HttpErrorResponse &&
              (refreshErr.status === 400 || refreshErr.status === 401)
            ) {
              debugAuthTrace("session-cleared", {
                reason: "invalid-refresh",
                url: req.url,
              });
              auth.handleUnauthorized();
            }
            return throwError(() => refreshErr);
          }),
        );
      }

      if (err.status === 401 && isRefreshCall) {
        debugAuthTrace("session-cleared", {
          reason: "refresh-endpoint-401",
          url: req.url,
        });
        auth.handleUnauthorized();
      }

      return throwError(() => err);
    }),
  );
};
