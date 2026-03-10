import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ThemeRequest, ThemeResponse } from "../models";

@Injectable({ providedIn: "root" })
export class ThemeSettingsService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/theme`;

  getTheme() {
    return this.http.get<ThemeResponse>(this.api);
  }

  updateTheme(dto: ThemeRequest) {
    return this.http.put<ThemeResponse>(this.api, dto);
  }
}
