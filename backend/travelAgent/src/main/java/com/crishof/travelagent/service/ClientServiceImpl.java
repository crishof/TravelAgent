package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerRequest;
import com.crishof.travelagent.dto.CustomerResponse;
import com.crishof.travelagent.exception.ClientNotFoundException;
import com.crishof.travelagent.model.Customer;
import com.crishof.travelagent.repository.ClientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {

    private final ClientRepository clientRepository;

    @Override
    public List<CustomerResponse> getAll() {
        List<Customer> customers = clientRepository.findAll();
        return customers.stream()
                .map(this::toClientResponse)
                .toList();
    }

    @Override
    public CustomerResponse getById(long id) {

        Customer customer = clientRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));
        return this.toClientResponse(customer);
    }

    @Override
    public CustomerResponse create(CustomerRequest customerRequest) {

        return this.toClientResponse(clientRepository.save(this.toClient(customerRequest)));
    }

    @Override
    public CustomerResponse update(long id, CustomerRequest customerRequest) {

        Customer customer = clientRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));

        customer.setName(customerRequest.getName());
        customer.setLastname(customerRequest.getLastname());
        customer.setEmail(customerRequest.getEmail());
        customer.setDni(customerRequest.getDni());
        customer.setPassport(customerRequest.getPassport());
        customer.setPhone(customerRequest.getPhone());
        return this.toClientResponse(clientRepository.save(customer));
    }

    @Override
    public String delete(long id) {
        Customer customer = clientRepository.findById(id).orElseThrow(() -> new ClientNotFoundException(id));
        clientRepository.delete(customer);
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
