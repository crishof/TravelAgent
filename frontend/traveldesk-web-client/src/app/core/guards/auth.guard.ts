import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";

/** Redirects to /auth/login if not authenticated */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  //TODO: habilitar para auth
//  if (auth.isLoggedIn()) return true;
return true;
  return router.createUrlTree(["/auth/login"]);
};

/** Redirects to /app/dashboard if already authenticated */
export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isLoggedIn()) return true;
  return router.createUrlTree(["/app/dashboard"]);
};

/** Restricts access to ADMIN role only */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAdmin()) return true;
  return router.createUrlTree(["/app/dashboard"]);
};
