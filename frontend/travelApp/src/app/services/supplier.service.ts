import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISupplier } from '../model/supplier.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `${environment.apiUrl}/supplier`;

  getAllSuppliers(): Observable<ISupplier[]> {
    return this._http.get<ISupplier[]>(`${this._urlBase}/getAll`);
  }

  getSupplierById(supplierId: number): Observable<ISupplier> {
    return this._http.get<ISupplier>(`${this._urlBase}/getById/${supplierId}`);
  }
}
