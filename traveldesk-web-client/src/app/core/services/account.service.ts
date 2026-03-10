import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import {
  AccountRequest,
  AccountResponse,
  AgencySettingsRequest,
  AgencySettingsResponse,
  CommissionSettingsRequest,
  CommissionSettingsResponse,
} from "../models";

@Injectable({ providedIn: "root" })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/account`;

  // ── Account ───────────────────────────────────────────────────────────────
  getAccount() {
    return this.http.get<AccountResponse>(this.api);
  }

  updateAccount(dto: AccountRequest) {
    return this.http.put<AccountResponse>(this.api, dto);
  }

  // ── Agency Settings ───────────────────────────────────────────────────────
  getAgencySettings() {
    return this.http.get<AgencySettingsResponse>(`${this.api}/agency`);
  }

  updateAgencySettings(dto: AgencySettingsRequest) {
    return this.http.put<AgencySettingsResponse>(`${this.api}/agency`, dto);
  }

  // ── Commission Settings ───────────────────────────────────────────────────
  getCommissionSettings() {
    return this.http.get<CommissionSettingsResponse>(`${this.api}/commission`);
  }

  updateCommissionSettings(dto: CommissionSettingsRequest) {
    return this.http.put<CommissionSettingsResponse>(
      `${this.api}/commission`,
      dto,
    );
  }
}
