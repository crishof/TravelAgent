import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ICustomer } from '../../model/customer.model';
import { CustomerService } from '../../services/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { LoadingComponent } from '../../utils/loading/loading.component';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, LoadingComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent implements OnInit {
  customerList: ICustomer[] = [];
  readonly _customerService = inject(CustomerService);
  readonly _router = inject(Router);
  readonly _route = inject(ActivatedRoute);
  isLoading: boolean = true;

  ngOnInit(): void {
    this.isLoading = true;
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
      setTimeout(() => {
        this.isLoading = false;
      }, 500); // Simulate a 500ms delay
    });
  }

  goToDetails(customerId: number): void {
    this._router.navigate([`/customer/customer-details`, customerId]);
  }
}
