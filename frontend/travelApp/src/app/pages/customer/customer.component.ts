import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ICustomer } from '../../model/customer.model';
import { CustomerService } from '../../services/customer.service';

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

  ngOnInit(): void {
    this._customerService.getAllCustomers().subscribe((data: ICustomer[]) => {
      this.customerList = data;
    });
  }
}
