package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.SupplierRequest;
import com.crishof.travelagent.model.Supplier;

import java.util.List;

public interface SupplierService {

    List<Supplier> getAll();

    Supplier getById(Long id);

    Supplier create(SupplierRequest supplierRequest);

    Supplier update(Long id, SupplierRequest supplierRequest);

    String delete(Long id);
}
