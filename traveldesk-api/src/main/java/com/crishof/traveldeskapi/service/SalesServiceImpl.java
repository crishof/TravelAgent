package com.crishof.traveldeskapi.service;

import com.crishof.traveldeskapi.dto.SaleRequest;
import com.crishof.traveldeskapi.dto.SaleResponse;
import com.crishof.traveldeskapi.exception.InvalidRequestException;
import com.crishof.traveldeskapi.exception.ResourceNotFoundException;
import com.crishof.traveldeskapi.model.*;
import com.crishof.traveldeskapi.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class SalesServiceImpl implements SalesService {

    private final SaleRepository saleRepository;
    private final AgencyRepository agencyRepository;
    private final CustomerRepository customerRepository;
    private final SupplierRepository supplierRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public List<SaleResponse> getAll(UUID agencyId) {
        validateAgencyId(agencyId);

        return saleRepository.findAllByAgencyIdOrderBySaleDateDesc(agencyId).stream().map(this::toResponse).toList();
    }

    @Override
    public SaleResponse create(UUID agencyId, UUID userId, SaleRequest request) {
        validateAgencyId(agencyId);
        validateUserId(userId);

        Agency agency = getAgencyOrThrow(agencyId);

        Customer customer = new Customer();
        if (request.customerId() != null) {

            customer = getCustomerOrThrow(agencyId, request.customerId());
        } else {
            customer.setAgency(agency);
            customer.setFullName(request.customerName());
            customerRepository.save(customer);

        }

        User createdBy = getUserOrThrow(userId, agencyId);

        Sale sale = new Sale();
        sale.setAgency(agency);
        sale.setCustomer(customer);

        sale.setCreatedBy(createdBy);
        sale.setDestination(normalizeText(request.destination()));
        sale.setAmount(request.amount());
        sale.setCurrency(agency.getCurrency());
        sale.setStatus(parseSaleStatus(request.status()));

        return toResponse(saleRepository.save(sale));
    }

    @Override
    public SaleResponse update(UUID agencyId, UUID id, SaleRequest request) {
        validateAgencyId(agencyId);

        Sale sale = getSaleOrThrow(agencyId, id);
        Customer customer = getCustomerOrThrow(agencyId, request.customerId());

        sale.setCustomer(customer);
        sale.setDestination(normalizeText(request.destination()));
        sale.setAmount(request.amount());
        sale.setStatus(parseSaleStatus(request.status()));

        return toResponse(saleRepository.save(sale));
    }

    @Override
    public void delete(UUID agencyId, UUID id) {
        validateAgencyId(agencyId);
        saleRepository.delete(getSaleOrThrow(agencyId, id));
    }

    @Override
    @Transactional(Transactional.TxType.SUPPORTS)
    public SaleResponse findById(UUID agencyId, UUID id) {
        validateAgencyId(agencyId);
        return toResponse(getSaleOrThrow(agencyId, id));
    }

    private Sale getSaleOrThrow(UUID agencyId, UUID id) {
        return saleRepository.findByIdAndAgencyId(id, agencyId).orElseThrow(() -> new ResourceNotFoundException("Sale not found with id: " + id));
    }

    private Agency getAgencyOrThrow(UUID agencyId) {
        return agencyRepository.findById(agencyId).orElseThrow(() -> new ResourceNotFoundException("Agency not found with id: " + agencyId));
    }

    private Customer getCustomerOrThrow(UUID agencyId, UUID customerId) {
        return customerRepository.findByIdAndAgencyId(customerId, agencyId).orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + customerId));
    }

    private Supplier getSupplierOrNull(UUID agencyId, UUID supplierId) {
        if (supplierId == null) {
            return null;
        }

        return supplierRepository.findByIdAndAgencyId(supplierId, agencyId).orElseThrow(() -> new ResourceNotFoundException("Supplier not found with id: " + supplierId));
    }

    private User getUserOrThrow(UUID userId, UUID agencyId) {
        return userRepository.findById(userId).filter(user -> user.getAgency().getId().equals(agencyId)).orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private SaleStatus parseSaleStatus(String status) {
        try {
            return SaleStatus.valueOf(normalizeEnumValue(status));
        } catch (IllegalArgumentException ex) {
            throw new InvalidRequestException("Invalid sale status: " + status);
        }
    }

    private String normalizeText(String value) {
        return value.trim().replaceAll("\\s+", " ");
    }

    private String normalizeEnumValue(String value) {
        return value.trim().replace('-', '_').replace(' ', '_').toUpperCase(Locale.ROOT);
    }

    private void validateAgencyId(UUID agencyId) {
        if (agencyId == null) {
            throw new InvalidRequestException("Agency id is required");
        }
    }

    private void validateUserId(UUID userId) {
        if (userId == null) {
            throw new InvalidRequestException("User id is required");
        }
    }

    private SaleResponse toResponse(Sale sale) {
        return new SaleResponse(sale.getId(),
                sale.getCustomer().getId(),
                sale.getCustomer().getFullName(),
                sale.getDestination(),
                sale.getAmount(),
                sale.getStatus().name());
    }
}