import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomer } from '../model/customer.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `${environment.apiUrl}/customer`;

  getAllCustomers(): Observable<ICustomer[]> {
    return this._http.get<ICustomer[]>(`${this._urlBase}/getAll`);
  }

  getCustomerById(id: number): Observable<ICustomer> {
    return this._http.get<ICustomer>(`${this._urlBase}/getById/${id}`);
  }
}
