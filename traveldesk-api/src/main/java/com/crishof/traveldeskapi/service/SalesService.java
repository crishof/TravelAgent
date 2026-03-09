package com.crishof.traveldeskapi.service;

import com.crishof.traveldeskapi.dto.SaleRequest;
import com.crishof.traveldeskapi.dto.SaleResponse;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

public interface SalesService {

    List<SaleResponse> getAll(UUID agencyId);

    SaleResponse create(UUID agencyId, UUID userId, @Valid SaleRequest request);

    SaleResponse update(UUID agencyId, UUID id, @Valid SaleRequest request);

    void delete(UUID agencyId, UUID id);

    SaleResponse findById(UUID agencyId, UUID id);
}