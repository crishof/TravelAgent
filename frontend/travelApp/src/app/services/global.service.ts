import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ISearchResultDTO } from '../model/searchResultDto';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor() {}

  readonly _http = inject(HttpClient);
  readonly _urlBase = `http://localhost:9001/globalSearch`;

  findByTerm(searchTerm: string): Observable<ISearchResultDTO> {
    return this._http.get<ISearchResultDTO>(`${this._urlBase}/findByTerm`, {
      params: { searchTerm },
    });
  }
}
