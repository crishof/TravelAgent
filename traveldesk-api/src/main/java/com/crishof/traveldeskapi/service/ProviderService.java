package com.crishof.traveldeskapi.service;

import com.crishof.traveldeskapi.dto.ProviderRequest;
import com.crishof.traveldeskapi.dto.ProviderResponse;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

public interface ProviderService {

    List<ProviderResponse> getAll(UUID agencyId);

    ProviderResponse create(UUID agencyId, @Valid ProviderRequest request);

    ProviderResponse update(UUID agencyId, UUID id, @Valid ProviderRequest request);

    void delete(UUID agencyId, UUID id);

    ProviderResponse findById(UUID agencyId, UUID id);
}
