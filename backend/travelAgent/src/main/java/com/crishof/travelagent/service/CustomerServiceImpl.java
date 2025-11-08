package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerRequest;
import com.crishof.travelagent.exception.CustomerNotFoundException;
import com.crishof.travelagent.mapper.CustomerMapper;
import com.crishof.travelagent.model.Customer;
import com.crishof.travelagent.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;
    private final UserService userService;


    @Override
    public List<Customer> getAll() {
        return customerRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(Customer::getLastName))
                .toList();
    }

    @Override
    public Customer getById(Long id) {

        return customerRepository.findById(id).orElseThrow(
                () -> new CustomerNotFoundException(id));
    }

    @Override
    public Customer create(CustomerRequest customerRequest) {

        Optional<Customer> existingCustomer = findMatchingCustomer(customerRequest);

        if (existingCustomer.isPresent()) {
            return existingCustomer.get();
        }

        Customer customer = customerMapper.toEntity(customerRequest);
        customer.setAgency(userService.getCurrentUser().getAgency());
        return customerRepository.save(customer);
    }

    @Override
    public Customer update(Long id, CustomerRequest customerRequest) {

        Customer customer = customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException(id));

        customerMapper.updateEntity(customerRequest, customer);

        return customerRepository.save(customer);
    }

    @Override
    public String delete(Long id) {
        Customer customer = customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException(id));
        customerRepository.delete(customer);
        return "Customer with id " + id + " deleted";
    }

    @Override
    public List<Customer> globalSearch(String searchTerm) {

        return customerRepository.globalSearch(searchTerm);

    }

    public Optional<Customer> findMatchingCustomer(CustomerRequest request) {

        if (StringUtils.hasText(request.getDni())) {
            return customerRepository.findByDni(request.getDni().trim());
        }

        if (StringUtils.hasText(request.getPassport())) {
            return customerRepository.findByPassport(request.getPassport().trim());
        }

        if (StringUtils.hasText(request.getEmail())) {
            return customerRepository.findByEmail(request.getEmail().trim());
        }

        return Optional.empty();
    }

    @Override
    public int getTotalCustomers() {
        return customerRepository.findAll().size();
    }
}
