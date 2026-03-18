package com.crishof.traveldeskapi.service;

import com.crishof.traveldeskapi.dto.AccountRequest;
import com.crishof.traveldeskapi.dto.AccountResponse;
import com.crishof.traveldeskapi.dto.AgencySettingsRequest;
import com.crishof.traveldeskapi.dto.AgencySettingsResponse;
import com.crishof.traveldeskapi.dto.CommissionSettingsRequest;
import com.crishof.traveldeskapi.dto.CommissionSettingsResponse;
import jakarta.validation.Valid;

import java.util.UUID;

public interface AccountService {

    AccountResponse getAccount(UUID userId);

    AccountResponse updateAccount(UUID userId, @Valid AccountRequest request);

    AgencySettingsResponse getAgencySettings(UUID agencyId);

    AgencySettingsResponse updateAgencySettings(UUID agencyId, @Valid AgencySettingsRequest request);

    CommissionSettingsResponse getCommissionSettings(UUID agencyId);

    CommissionSettingsResponse updateCommissionSettings(UUID agencyId, @Valid CommissionSettingsRequest request);
}
