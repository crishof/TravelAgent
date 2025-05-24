import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExchangeService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `http://localhost:9001/api/exchange-rate`;
  getExchangeRate(from: string, to: string): Observable<number> {
    return this._http.get<number>(`${this._urlBase}/getSync`, {
      params: { from, to },
    });
  }
}
