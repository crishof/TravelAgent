import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SaleComponent } from './pages/sale/sale.component';
import { AgentComponent } from './pages/agent/agent.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { BookingComponent } from './pages/booking/booking.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sale', component: SaleComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'agent', component: AgentComponent },
  { path: 'customer', component: CustomerComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: '**', redirectTo: '' },
];
