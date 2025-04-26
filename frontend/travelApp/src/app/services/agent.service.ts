import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IAgent } from '../model/agent.model';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  constructor() {}

  private _http = inject(HttpClient);
  private _urlBase = `http://localhost:9001/agent`;

  getAllAgents(): Observable<IAgent[]> {
    return this._http.get<IAgent[]>(`${this._urlBase}/getAll`);
  }
}
