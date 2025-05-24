import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICustomerPayment } from '../model/customerPayment.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerPaymentService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `http://localhost:9001/customerPayment`;

  getPaymentsByCustomerAndSaleId(
    customerId: number,
    saleId: number
  ): Observable<ICustomerPayment[]> {
    return this._http.get<ICustomerPayment[]>(
      `${this._urlBase}/customers/${customerId}/travel/${saleId}/payments`
    );
  }

  addPayment(payment: ICustomerPayment): Observable<ICustomerPayment> {
    console.log('Adding payment:', payment);
    return this._http.post<ICustomerPayment>(`${this._urlBase}/save`, payment);
  }
}
