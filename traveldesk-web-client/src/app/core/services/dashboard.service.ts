import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { DashboardStatsResponse } from "../models";

@Injectable({ providedIn: "root" })
export class DashboardService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/dashboard`;

  getStats() {
    return this.http.get<DashboardStatsResponse>(`${this.api}/stats`);
  }
}
