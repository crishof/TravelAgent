import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISearchResultDTO } from '../model/searchResultDto';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `${environment.apiUrl}/globalSearch`;

  findByTerm(searchTerm: string): Observable<ISearchResultDTO> {
    return this._http.get<ISearchResultDTO>(`${this._urlBase}/findByTerm`, {
      params: { searchTerm },
    });
  }
}
