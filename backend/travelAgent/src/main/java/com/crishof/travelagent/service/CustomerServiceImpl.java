package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerRequest;
import com.crishof.travelagent.dto.CustomerResponse;
import com.crishof.travelagent.exception.ClientNotFoundException;
import com.crishof.travelagent.model.Customer;
import com.crishof.travelagent.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;


    @Override
    public List<CustomerResponse> getAll() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream().map(this::toCustomerResponse).toList();
    }

    @Override
    public CustomerResponse getById(Long id) {

        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));
        return this.toCustomerResponse(customer);
    }

    @Override
    public CustomerResponse create(CustomerRequest customerRequest) {

        return this.toCustomerResponse(customerRepository.save(this.toCustomer(customerRequest)));
    }

    @Override
    public Long getIdFromNewSale(CustomerRequest customerRequest) {

        Customer customer = customerRepository.findByDniOrPassport(customerRequest.getDni(), customerRequest.getPassport());
        if (customer == null) {
            return this.create(customerRequest).getId();
        } else {
            return customer.getId();
        }
    }

    @Override
    public CustomerResponse update(Long id, CustomerRequest customerRequest) {

        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));

        customer.setName(customerRequest.getName());
        customer.setLastname(customerRequest.getLastname());
        customer.setEmail(customerRequest.getEmail());
        customer.setDni(customerRequest.getDni());
        customer.setPassport(customerRequest.getPassport());
        customer.setPhone(customerRequest.getPhone());
        return this.toCustomerResponse(customerRepository.save(customer));
    }

    @Override
    public String delete(Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));
        customerRepository.delete(customer);
        return "Customer with id " + id + " deleted";
    }

    @Override
    public List<CustomerResponse> globalSearch(String searchTerm) {

        List<Customer> customers = customerRepository.globalSearch(searchTerm);
        return customers.stream().map(this::toCustomerResponse).toList();
    }

    private CustomerResponse toCustomerResponse(Customer customer) {
        CustomerResponse customerResponse = new CustomerResponse();

        customerResponse.setId(customer.getId());
        customerResponse.setName(customer.getName());
        customerResponse.setLastname(customer.getLastname());
        customerResponse.setPhone(customer.getPhone());
        customerResponse.setDni(customer.getDni());
        customerResponse.setPassport(customer.getPassport());
        customerResponse.setEmail(customer.getEmail());
        return customerResponse;
    }

    private Customer toCustomer(CustomerRequest customerRequest) {

        String name = customerRequest.getName();
        String formattedName = name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();


        return Customer.builder().name(formattedName).lastname(customerRequest.getLastname().toUpperCase()).email(customerRequest.getEmail()).dni(customerRequest.getDni()).passport(customerRequest.getPassport()).phone(customerRequest.getPhone()).build();

    }
}
