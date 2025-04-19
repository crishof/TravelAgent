import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layout/navbar/navbar.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { AgentComponent } from "./features/agent/agent.component";
import { CustomerComponent } from "./features/customer/customer.component";
import { SaleComponent } from "./features/sale/sale.component";
import { SupplierComponent } from "./features/supplier/supplier.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, AgentComponent, CustomerComponent, SaleComponent, SupplierComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'travel-agent-ui';
}
