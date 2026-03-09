package com.crishof.traveldeskapi.service;

import com.crishof.traveldeskapi.dto.ProviderRequest;
import com.crishof.traveldeskapi.dto.ProviderResponse;
import com.crishof.traveldeskapi.exception.ConflictException;
import com.crishof.traveldeskapi.exception.InvalidRequestException;
import com.crishof.traveldeskapi.exception.ResourceNotFoundException;
import com.crishof.traveldeskapi.mapper.ProviderMapper;
import com.crishof.traveldeskapi.model.Agency;
import com.crishof.traveldeskapi.model.Provider;
import com.crishof.traveldeskapi.model.ProviderType;
import com.crishof.traveldeskapi.repository.AgencyRepository;
import com.crishof.traveldeskapi.repository.ProviderRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.UUID;


@Service
@RequiredArgsConstructor
@Transactional
public class ProviderServiceImpl implements ProviderService {

    private final ProviderRepository providerRepository;
    private final AgencyRepository agencyRepository;
    private final ProviderMapper providerMapper;

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<ProviderResponse> getAll(UUID agencyId) {
        validateAgencyId(agencyId);

        return providerRepository.findAllByAgencyIdOrderByNameAsc(agencyId).stream()
                .map(providerMapper::toResponse)
                .toList();
    }

    @Override
    public ProviderResponse create(UUID agencyId, ProviderRequest request) {
        validateAgencyId(agencyId);

        Agency agency = getAgencyOrThrow(agencyId);

        String normalizedEmail = normalizeEmail(request.email());
        String normalizedName = normalizeText(request.name());
        String normalizedPhone = normalizePhone(request.phone());
        ProviderType providerType = parseProviderType(request.serviceType());

        validateProviderEmailUniqueness(agencyId, normalizedEmail);

        Provider provider = providerMapper.toEntity(request);
        provider.setAgency(agency);
        provider.setName(normalizedName);
        provider.setEmail(normalizedEmail);
        provider.setPhone(normalizedPhone);
        provider.setType(providerType);

        Provider savedProvider = providerRepository.save(provider);
        return providerMapper.toResponse(savedProvider);
    }

    @Override
    public ProviderResponse update(UUID agencyId, UUID id, ProviderRequest request) {
        validateAgencyId(agencyId);

        Provider provider = getProviderOrThrow(agencyId, id);

        String normalizedEmail = normalizeEmail(request.email());
        String normalizedName = normalizeText(request.name());
        String normalizedPhone = normalizePhone(request.phone());
        ProviderType providerType = parseProviderType(request.serviceType());

        validateProviderEmailUniquenessForUpdate(agencyId, normalizedEmail, id);

        providerMapper.updateEntityFromRequest(request, provider);
        provider.setName(normalizedName);
        provider.setEmail(normalizedEmail);
        provider.setPhone(normalizedPhone);
        provider.setType(providerType);

        Provider updatedProvider = providerRepository.save(provider);
        return providerMapper.toResponse(updatedProvider);
    }

    @Override
    public void delete(UUID agencyId, UUID id) {
        validateAgencyId(agencyId);

        Provider provider = getProviderOrThrow(agencyId, id);
        providerRepository.delete(provider);
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public ProviderResponse findById(UUID agencyId, UUID id) {
        validateAgencyId(agencyId);
        return providerMapper.toResponse(getProviderOrThrow(agencyId, id));
    }

    private Provider getProviderOrThrow(UUID agencyId, UUID id) {
        return providerRepository.findByIdAndAgencyId(id, agencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Provider not found with id: " + id));
    }

    private Agency getAgencyOrThrow(UUID agencyId) {
        return agencyRepository.findById(agencyId)
                .orElseThrow(() -> new ResourceNotFoundException("Agency not found with id: " + agencyId));
    }

    private void validateProviderEmailUniqueness(UUID agencyId, String normalizedEmail) {
        if (providerRepository.existsByAgencyIdAndEmailIgnoreCase(agencyId, normalizedEmail)) {
            throw new ConflictException("Provider email " + normalizedEmail + " is already in use");
        }
    }

    private void validateProviderEmailUniquenessForUpdate(UUID agencyId, String normalizedEmail, UUID providerId) {
        if (providerRepository.existsByAgencyIdAndEmailIgnoreCaseAndIdNot(agencyId, normalizedEmail, providerId)) {
            throw new ConflictException("Provider email " + normalizedEmail + " is already in use");
        }
    }

    private ProviderType parseProviderType(String serviceType) {
        try {
            return ProviderType.valueOf(normalizeEnumValue(serviceType));
        } catch (IllegalArgumentException ex) {
            throw new InvalidRequestException("Invalid provider service type: " + serviceType);
        }
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeText(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }

    private String normalizePhone(String phone) {
        return phone.trim().replaceAll("\\s+", " ");
    }

    private String normalizeEnumValue(String value) {
        return value.trim()
                .replace('-', '_')
                .replace(' ', '_')
                .toUpperCase(Locale.ROOT);
    }

    private void validateAgencyId(UUID agencyId) {
        if (agencyId == null) {
            throw new InvalidRequestException("Agency id is required");
        }
    }
}
