package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerRequest;
import com.crishof.travelagent.dto.CustomerResponse;

import java.util.List;

public interface CustomerService {

    List<CustomerResponse> getAll();

    CustomerResponse getById(long id);

    CustomerResponse create(CustomerRequest customerRequest);

    CustomerResponse update(long id, CustomerRequest customerRequest);

    String delete(long id);

    Long getIdFromNewSale(CustomerRequest customerRequest);
}
