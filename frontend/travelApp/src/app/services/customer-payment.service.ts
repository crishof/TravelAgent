import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ICustomerPayment } from '../model/customerPayment.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerPaymentService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `${environment.apiUrl}/customerPayment`;

  getPaymentsByCustomerAndSaleId(
    customerId: number,
    saleId: number
  ): Observable<ICustomerPayment[]> {
    return this._http.get<ICustomerPayment[]>(
      `${this._urlBase}/customers/${customerId}/travel/${saleId}/payments`
    );
  }

  addPayment(payment: ICustomerPayment): Observable<ICustomerPayment> {
    return this._http.post<ICustomerPayment>(`${this._urlBase}/save`, payment);
  }
}
