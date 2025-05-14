import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPayment } from '../model/payment.model';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `http://localhost:9001/payment`;

  getPaymentsBySaleId(id: number): Observable<IPayment[]> {
    return this._http.get<IPayment[]>(`${this._urlBase}/getAllBySaleId/${id}`);
  }
}
