package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.dto.ProviderRequest;
import com.crishof.traveldeskapi.dto.ProviderResponse;
import com.crishof.traveldeskapi.security.SecurityUser;
import com.crishof.traveldeskapi.service.ProviderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/providers")
@RequiredArgsConstructor
@Slf4j
public class ProviderController {

    private final ProviderService providerService;

    //  ===============
    //  GET PROVIDERS
    //  ===============

    @Operation(summary = "Get providers")
    @ApiResponse(responseCode = "200", description = "Providers retrieved successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<java.util.List<ProviderResponse>> getProviders(@AuthenticationPrincipal SecurityUser securityUser) {
        log.info("Get providers request received for userId={}", securityUser.getId());
        return ResponseEntity.ok(providerService.getAll(securityUser.getAgencyId()));
    }

    //  ===============
    //  CREATE PROVIDER
    //  ===============

    @Operation(summary = "Create a new provider")
    @ApiResponse(responseCode = "201", description = "Provider created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<ProviderResponse> createProvider(@AuthenticationPrincipal SecurityUser securityUser, @Valid @RequestBody ProviderRequest request) {
        log.info("Create provider request received for userId={}, name={}", securityUser.getId(), request.name());
        return ResponseEntity.status(HttpStatusCode.valueOf(201)).body(providerService.create(securityUser.getAgencyId(), request));
    }

    //  ===============
    //  UPDATE PROVIDER
    //  ===============

    @Operation(summary = "Update a provider")
    @ApiResponse(responseCode = "200", description = "Provider updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "404", description = "Provider not found")
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<ProviderResponse> updateProvider(@AuthenticationPrincipal SecurityUser securityUser, @PathVariable java.util.UUID id, @Valid @RequestBody ProviderRequest request) {
        log.info("Update provider request received for userId={}, providerId={}", securityUser.getId(), id);
        return ResponseEntity.ok(providerService.update(securityUser.getAgencyId(), id, request));
    }

    //  ===============
    //  GET PROVIDER BY ID
    //  ===============

    @Operation(summary = "Get a provider by ID")
    @ApiResponse(responseCode = "200", description = "Provider found successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "404", description = "Provider not found")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<ProviderResponse> getProviderById(@AuthenticationPrincipal SecurityUser securityUser, @PathVariable java.util.UUID id) {
        log.info("Get provider by ID request received for userId={}, providerId={}", securityUser.getId(), id);
        return ResponseEntity.ok(providerService.findById(securityUser.getAgencyId(), id));
    }

    //  ===============
    //  DELETE PROVIDER
    //  ===============

    @Operation(summary = "Delete a provider")
    @ApiResponse(responseCode = "204", description = "Provider deleted successfully")
    @ApiResponse(responseCode = "401", description = "Unauthorized")
    @ApiResponse(responseCode = "404", description = "Provider not found")
    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvider(@AuthenticationPrincipal SecurityUser securityUser, @PathVariable java.util.UUID id) {
        log.info("Delete provider request received for userId={}, providerId={}", securityUser.getId(), id);
        providerService.delete(securityUser.getAgencyId(), id);
        return ResponseEntity.noContent().build();
    }
}