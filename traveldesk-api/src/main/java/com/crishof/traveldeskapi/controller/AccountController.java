package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.dto.AccountRequest;
import com.crishof.traveldeskapi.dto.AccountResponse;
import com.crishof.traveldeskapi.dto.AgencySettingsRequest;
import com.crishof.traveldeskapi.dto.AgencySettingsResponse;
import com.crishof.traveldeskapi.dto.CommissionSettingsRequest;
import com.crishof.traveldeskapi.dto.CommissionSettingsResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/account")
@RequiredArgsConstructor
@Slf4j
public class AccountController {

    //  ===============
    //  GET ACCOUNT
    //  ===============

    @Operation(summary = "Get account")
    @ApiResponse(responseCode = "200", description = "Account retrieved successfully")
    @GetMapping
    public ResponseEntity<AccountResponse> getAccount() {
        log.info("Get account request received");
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  UPDATE ACCOUNT
    //  ===============

    @Operation(summary = "Update account")
    @ApiResponse(responseCode = "200", description = "Account updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PutMapping
    public ResponseEntity<AccountResponse> updateAccount(@Valid @RequestBody AccountRequest request) {
        log.info("Update account request received for email={}", request.email());
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  GET AGENCY SETTINGS
    //  ===============

    @Operation(summary = "Get agency settings")
    @ApiResponse(responseCode = "200", description = "Agency settings retrieved successfully")
    @GetMapping("/agency")
    public ResponseEntity<AgencySettingsResponse> getAgencySettings() {
        log.info("Get agency settings request received");
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  UPDATE AGENCY SETTINGS
    //  ===============

    @Operation(summary = "Update agency settings")
    @ApiResponse(responseCode = "200", description = "Agency settings updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PutMapping("/agency")
    public ResponseEntity<AgencySettingsResponse> updateAgencySettings(@Valid @RequestBody AgencySettingsRequest request) {
        log.info("Update agency settings request received for agencyName={}", request.agencyName());
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  GET COMMISSION SETTINGS
    //  ===============

    @Operation(summary = "Get commission settings")
    @ApiResponse(responseCode = "200", description = "Commission settings retrieved successfully")
    @GetMapping("/commission")
    public ResponseEntity<CommissionSettingsResponse> getCommissionSettings() {
        log.info("Get commission settings request received");
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  UPDATE COMMISSION SETTINGS
    //  ===============

    @Operation(summary = "Update commission settings")
    @ApiResponse(responseCode = "200", description = "Commission settings updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PutMapping("/commission")
    public ResponseEntity<CommissionSettingsResponse> updateCommissionSettings(@Valid @RequestBody CommissionSettingsRequest request) {
        log.info("Update commission settings request received");
        return ResponseEntity.ok().build();
    }
}