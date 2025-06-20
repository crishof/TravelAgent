package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerRequest;
import com.crishof.travelagent.model.Customer;

import java.util.List;

public interface CustomerService {

    List<Customer> getAll();

    Customer getById(Long id);

    Customer create(CustomerRequest customerRequest);

    Customer update(Long id, CustomerRequest customerRequest);

    String delete(Long id);

    List<Customer> globalSearch(String searchTerm);
}
