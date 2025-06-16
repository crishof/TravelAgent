import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  // Rutas públicas
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register-admin',
    loadComponent: () =>
      import('./pages/auth/register-admin/register-admin.component').then(
        (m) => m.RegisterAdminComponent
      ),
  },
  {
    path: 'register-user',
    loadComponent: () =>
      import('./pages/auth/register-user/register-user.component').then(
        (m) => m.RegisterUserComponent
      ),
  },

  // Rutas protegidas (lazy loading bajo un padre)
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((m) => m.HomeComponent),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'sale',
        loadComponent: () =>
          import('./pages/sale/sale.component').then((m) => m.SaleComponent),
      },
      {
        path: 'sale/createSale',
        loadComponent: () =>
          import('./pages/sale/create-sale/create-sale.component').then(
            (m) => m.CreateSaleComponent
          ),
      },
      {
        path: 'sale/sale-details/:id',
        loadComponent: () =>
          import('./pages/sale/sale-details/sale-details.component').then(
            (m) => m.SaleDetailsComponent
          ),
      },
      {
        path: 'booking',
        loadComponent: () =>
          import('./pages/booking/booking.component').then(
            (m) => m.BookingComponent
          ),
      },
      {
        path: 'booking/booking-details/:id',
        loadComponent: () =>
          import(
            './pages/booking/booking-details/booking-details.component'
          ).then((m) => m.BookingDetailsComponent),
      },
      {
        path: 'agent',
        loadComponent: () =>
          import('./pages/agent/agent.component').then((m) => m.AgentComponent),
      },
      {
        path: 'customer',
        loadComponent: () =>
          import('./pages/customer/customer.component').then(
            (m) => m.CustomerComponent
          ),
      },
      {
        path: 'supplier',
        loadComponent: () =>
          import('./pages/supplier/supplier.component').then(
            (m) => m.SupplierComponent
          ),
      },
      {
        path: 'customer/customer-details/:id',
        loadComponent: () =>
          import(
            './pages/customer/customer-details/customer-details.component'
          ).then((m) => m.CustomerDetailsComponent),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
