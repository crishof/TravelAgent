import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBooking } from '../model/booking.model';
import { environment } from '../../environments/environment';
import { ITopSupplier } from '../model/topSupplier';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `${environment.apiUrl}/booking`;
  readonly _urlDashboard = `${environment.apiUrl}/dashboard`;

  getAllBookings(): Observable<IBooking[]> {
    return this._http.get<IBooking[]>(`${this._urlBase}/getAll`);
  }

  createBooking(bookingRequest: IBooking): Observable<any> {
    return this._http.post(`${this._urlBase}/save`, bookingRequest);
  }

  getTopSuppliers(): Observable<ITopSupplier[]> {
    return this._http.get<ITopSupplier[]>(
      `${this._urlDashboard}/getTopSuppliers`
    );
  }

  getNonPaidBookings(): Observable<IBooking[]> {
    return this._http.get<IBooking[]>(
      `${this._urlDashboard}/getNonPaidBookings`
    );
  }
}
