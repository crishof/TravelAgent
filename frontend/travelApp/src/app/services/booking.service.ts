import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBooking } from '../model/booking.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `${environment.apiUrl}/booking`;

  getAllBookings(): Observable<IBooking[]> {
    return this._http.get<IBooking[]>(`${this._urlBase}/getAll`);
  }
}
