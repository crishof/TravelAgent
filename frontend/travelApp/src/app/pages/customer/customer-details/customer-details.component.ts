import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SaleService } from '../../../services/sale.service';
import { ICustomer } from '../../../model/customer.model';
import { ISale } from '../../../model/sale.model';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.css',
})
export class CustomerDetailsComponent implements OnInit {
  customerId: string | null = null;
  customer: ICustomer | null = null;
  trips: ISale[] = [];
  isLoading: boolean = true;

  readonly _customerService = inject(CustomerService);
  readonly _saleService = inject(SaleService);
  constructor(readonly route: ActivatedRoute) {}

  ngOnInit() {
    const customerId = this.route.snapshot.paramMap.get('id');
    if (customerId) {
      this.customerId = customerId;
      this.loadCustomerDetails(Number(customerId));
    }
  }

  loadCustomerDetails(customerId: number): void {
    this._customerService.getCustomerById(customerId).subscribe({
      next: (data) => {
        this.customer = data;
        this.loadCustomerTrips(customerId);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading customer details:', error);
        this.isLoading = false;
      },
    });
  }

  loadCustomerTrips(customerId: number): void {
    this._saleService.getSalesByCustomerId(customerId).subscribe({
      next: (data) => {
        this.trips = data;
      },
      error: (error) => {
        console.error('Error loading customer trips:', error);
      },
    });
  }
}
