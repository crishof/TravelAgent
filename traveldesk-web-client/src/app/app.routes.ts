import { Routes } from '@angular/router';
import { authGuard, guestGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'app/dashboard', pathMatch: 'full' },

  // ── Auth routes (guest only) ───────────────────────────────────────────────
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'invite/:token',
        canActivate: [],                // No guard — public route
        loadComponent: () =>
          import('./features/auth/accept-invite/accept-invite.component').then(m => m.AcceptInviteComponent)
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // ── App shell (authenticated) ──────────────────────────────────────────────
  {
    path: 'app',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        title: 'Dashboard — TravelDesk'
      },
      {
        path: 'sales',
        loadComponent: () =>
          import('./features/sales/sales.component').then(m => m.SalesComponent),
        title: 'Ventas — TravelDesk'
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./features/bookings/bookings.component').then(m => m.BookingsComponent),
        title: 'Reservas — TravelDesk'
      },
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/clients/clients.component').then(m => m.ClientsComponent),
        title: 'Clientes — TravelDesk'
      },
      {
        path: 'providers',
        loadComponent: () =>
          import('./features/providers/providers.component').then(m => m.ProvidersComponent),
        title: 'Proveedores — TravelDesk'
      },
      {
        path: 'team',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/team/team.component').then(m => m.TeamComponent),
        title: 'Equipo — TravelDesk'
      },
      {
        path: 'account',
        loadComponent: () =>
          import('./features/account/account.component').then(m => m.AccountComponent),
        title: 'Mi Cuenta — TravelDesk'
      },
      {
        path: 'agency-settings',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/account/agency-settings/agency-settings.component').then(m => m.AgencySettingsComponent),
        title: 'Configuración de Agencia — TravelDesk'
      },
      {
        path: 'commission-account',
        loadComponent: () =>
          import('./features/account/commission-account/commission-account.component').then(m => m.CommissionAccountComponent),
        title: 'Cuenta de Comisiones — TravelDesk'
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // ── Fallback ───────────────────────────────────────────────────────────────
  { path: '**', redirectTo: 'app/dashboard' }
];
