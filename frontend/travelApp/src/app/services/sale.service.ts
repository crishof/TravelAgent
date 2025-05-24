import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISale } from '../model/sale.model';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `http://localhost:9001/travelSale`;

  getAllSales(): Observable<ISale[]> {
    return this._http.get<ISale[]>(`${this._urlBase}/getAll`);
  }

  createSale(travelSaleRequest: any): Observable<any> {
    return this._http.post(`${this._urlBase}/save`, travelSaleRequest);
  }

  getSaleById(id: number): Observable<ISale[]> {
    return this._http.get<ISale[]>(`${this._urlBase}/getById/${id}`);
  }

  getSalesByCustomerId(customerId: number): Observable<ISale[]> {
    return this._http.get<ISale[]>(
      `${this._urlBase}/getAllByCustomerId/${customerId}`
    );
  }

  getCurrentFee(saleId: number): Observable<number> {
    return this._http.get<number>(`${this._urlBase}/getTravelFee/${saleId}`);
  }
}
