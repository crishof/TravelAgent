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
        return customers.stream()
                .map(this::toClientResponse)
                .toList();
    }

    @Override
    public CustomerResponse getById(Long id) {

        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));
        return this.toClientResponse(customer);
    }

    @Override
    public CustomerResponse create(CustomerRequest customerRequest) {

        return this.toClientResponse(customerRepository.save(this.toClient(customerRequest)));
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
        return this.toClientResponse(customerRepository.save(customer));
    }

    @Override
    public String delete(Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));
        customerRepository.delete(customer);
        return "Customer with id " + id + " deleted";
    }

    private CustomerResponse toClientResponse(Customer customer) {
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

    private Customer toClient(CustomerRequest customerRequest) {
        Customer customer = new Customer();
        customer.setName(customerRequest.getName());
        customer.setLastname(customerRequest.getLastname());
        customer.setEmail(customerRequest.getEmail());
        customer.setDni(customerRequest.getDni());
        customer.setPassport(customerRequest.getPassport());
        customer.setPhone(customerRequest.getPhone());
        return customer;
    }
}
