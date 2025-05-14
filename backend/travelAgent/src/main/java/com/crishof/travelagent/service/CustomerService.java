package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerRequest;
import com.crishof.travelagent.dto.CustomerResponse;

import java.util.List;

public interface CustomerService {

    List<CustomerResponse> getAll();

    CustomerResponse getById(Long id);

    CustomerResponse create(CustomerRequest customerRequest);

    CustomerResponse update(Long id, CustomerRequest customerRequest);

    String delete(Long id);

    Long getIdFromNewSale(CustomerRequest customerRequest);
}
