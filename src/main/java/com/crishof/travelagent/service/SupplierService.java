package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.SupplierRequest;
import com.crishof.travelagent.dto.SupplierResponse;

import java.util.List;

public interface SupplierService {

    List<SupplierResponse> getAll();

    SupplierResponse getById(Long id);

    SupplierResponse create(SupplierRequest supplierRequest);

    SupplierResponse update(Long id, SupplierRequest supplierRequest);

    String delete(Long id);
}
