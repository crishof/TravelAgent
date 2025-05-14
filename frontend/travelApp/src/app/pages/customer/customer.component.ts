import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ICustomer } from '../../model/customer.model';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  customerList: ICustomer[] = [];
  readonly _customerService = inject(CustomerService);
  readonly _router = inject(Router);

  ngOnInit(): void {
    this._customerService.getAllCustomers().subscribe((data: ICustomer[]) => {
      this.customerList = data;
    });
  }

  goToDetails(customerId: number): void {
    this._router.navigate([`/customer/customer-details`, customerId]);
  }
}
