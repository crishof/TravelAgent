import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomer } from '../model/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `http://localhost:9001/customer`;

  getAllCustomers(): Observable<ICustomer[]> {
    return this._http.get<ICustomer[]>(`${this._urlBase}/getAll`);
  }
}
