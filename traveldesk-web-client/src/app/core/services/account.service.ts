import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import {
  AccountRequest,
  AccountResponse,
  AccountStatementResponse,
  AccountPaymentRequest,
  AgencySettingsRequest,
  AgencySettingsResponse,
  CommissionSettingsRequest,
  CommissionSettingsResponse,
  Currency,
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

  getAccountStatement(currency: Currency) {
    return this.http.get<AccountStatementResponse>(
      `${environment.apiUrl}/account-statement/me`,
      {
        params: { currency },
      },
    );
  }

  addAccountPayment(dto: AccountPaymentRequest) {
    return this.http.post<AccountStatementResponse>(
      `${environment.apiUrl}/account-statement/me/payments`,
      dto,
    );
  }

  updateAccountPayment(paymentId: string, dto: AccountPaymentRequest) {
    return this.http.put<AccountStatementResponse>(
      `${environment.apiUrl}/account-statement/me/payments/${paymentId}`,
      dto,
    );
  }

  deleteAccountPayment(paymentId: string) {
    return this.http.delete<AccountStatementResponse>(
      `${environment.apiUrl}/account-statement/me/payments/${paymentId}`,
    );
  }
}
