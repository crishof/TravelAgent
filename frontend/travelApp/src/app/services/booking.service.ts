import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBooking } from '../model/booking.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `http://localhost:9001/booking`;

  getAllBookings(): Observable<IBooking[]> {
    return this._http.get<IBooking[]>(`${this._urlBase}/getAll`);
  }
}
