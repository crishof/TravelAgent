import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPayment } from '../model/payment.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `${environment.apiUrl}/payment`;

  getPaymentsBySaleId(id: number): Observable<IPayment[]> {
    return this._http.get<IPayment[]>(`${this._urlBase}/getAllBySaleId/${id}`);
  }

  savePayment(payment: IPayment): Observable<IPayment> {
    return this._http.post<IPayment>(`${this._urlBase}/save`, payment);
  }
}
