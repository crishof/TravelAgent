import { Routes } from '@angular/router';
import { AgentComponent } from './pages/agent/agent.component';
import { SaleComponent } from './pages/sale/sale.component';
import { CustomerComponent } from './pages/customer/customer.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
import { BookingComponent } from './pages/booking/booking.component';
import { HomeComponent } from './pages/home/home.component';
import { CreateSaleComponent } from './pages/sale/create-sale/create-sale.component';
import { SaleDetailsComponent } from './pages/sale/sale-details/sale-details.component';
import { CustomerDetailsComponent } from './pages/customer/customer-details/customer-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'sale', component: SaleComponent },
  { path: 'sale/createSale', component: CreateSaleComponent },
  { path: 'sale/sale-details/:id', component: SaleDetailsComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'agent', component: AgentComponent },
  { path: 'customer', component: CustomerComponent },
  {
    path: 'customer/customer-details/:id',
    component: CustomerDetailsComponent,
  },
  { path: 'supplier', component: SupplierComponent },
  { path: '**', redirectTo: '' },
];
