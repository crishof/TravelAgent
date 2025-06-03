import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `${environment.apiUrl}/exchange-rate`;
  getExchangeRate(from: string, to: string): Observable<number> {
    return this._http.get<number>(`${this._urlBase}/getSync`, {
      params: { from, to },
    });
  }
}
