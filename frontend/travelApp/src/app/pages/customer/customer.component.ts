import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ICustomer } from '../../model/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

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
  readonly _route = inject(ActivatedRoute);

  ngOnInit(): void {
    combineLatest([
      this._customerService.getAllCustomers(),
      this._route.queryParams,
    ]).subscribe(([data, params]) => {
      let filteredList = data;
      if (params['ids']) {
        const ids = params['ids'].split(',').map((id: string) => +id);
        filteredList = data.filter((customer) => ids.includes(customer.id));
      }
      this.customerList = filteredList;
    });
  }

  goToDetails(customerId: number): void {
    this._router.navigate([`/customer/customer-details`, customerId]);
  }
}
