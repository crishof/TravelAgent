package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.SupplierRequest;
import com.crishof.travelagent.dto.SupplierResponse;
import com.crishof.travelagent.exception.SupplierNotFoundException;
import com.crishof.travelagent.model.Supplier;
import com.crishof.travelagent.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierServiceImpl implements SupplierService {

    private final SupplierRepository supplierRepository;

    @Override
    public List<SupplierResponse> getAll() {

        List<Supplier> suppliers = supplierRepository.findAll();
        return suppliers.stream()
                .map(this::toSupplierResponse)
                .toList();
    }

    @Override
    public SupplierResponse getById(Long id) {
        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new SupplierNotFoundException(id));

        return this.toSupplierResponse(supplier);
    }

    @Override
    public SupplierResponse create(SupplierRequest supplierRequest) {
        return this.toSupplierResponse(supplierRepository.save(toSupplier(supplierRequest)));
    }

    @Override
    public SupplierResponse update(Long id, SupplierRequest supplierRequest) {

        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new SupplierNotFoundException(id));

        supplier.setSupplierName(supplierRequest.getSupplierName());
        supplier.setCurrency(supplierRequest.getCurrency());
        return this.toSupplierResponse(supplierRepository.save(supplier));
    }

    @Override
    public String delete(Long id) {

        Supplier supplier = supplierRepository.findById(id).orElseThrow(() -> new SupplierNotFoundException(id));
        supplierRepository.delete(supplier);
        return "Supplier with id " + id + "deleted";
    }

    private SupplierResponse toSupplierResponse(Supplier supplier) {
        SupplierResponse supplierResponse = new SupplierResponse();

        supplierResponse.setId(supplier.getId());
        supplierResponse.setSupplierName(supplier.getSupplierName());
        supplierResponse.setCurrency(supplier.getCurrency());
        return supplierResponse;
    }

    private Supplier toSupplier(SupplierRequest supplierRequest) {

        Supplier supplier = new Supplier();
        supplier.setSupplierName(supplierRequest.getSupplierName());
        supplier.setCurrency(supplierRequest.getCurrency());
        return supplier;
    }
}
