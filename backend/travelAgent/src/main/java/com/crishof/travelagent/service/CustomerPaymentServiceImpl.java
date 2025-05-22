package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerPaymentRequest;
import com.crishof.travelagent.dto.CustomerPaymentResponse;
import com.crishof.travelagent.exception.CustomerPaymentNotFoundException;
import com.crishof.travelagent.model.CustomerPayment;
import com.crishof.travelagent.repository.CustomerPaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerPaymentServiceImpl implements CustomerPaymentService {

    private final CustomerPaymentRepository customerPaymentRepository;


    @Override
    public List<CustomerPaymentResponse> getAll() {
        return customerPaymentRepository.findAll().stream()
                .map(this::toCustomerPaymentResponse).sorted(Comparator.comparing(CustomerPaymentResponse::getPaymentDate))
                .toList();
    }

    @Override
    public CustomerPaymentResponse getById(Long id) {
        return this.toCustomerPaymentResponse(customerPaymentRepository.findById(id).orElseThrow(() -> new CustomerPaymentNotFoundException(id)));
    }

    @Override
    public CustomerPaymentResponse create(CustomerPaymentRequest paymentRequest) {

        CustomerPayment payment = CustomerPayment.builder()
                .paymentDate(LocalDate.now())
                .travelId(paymentRequest.getTravelId())
                .customerId(paymentRequest.getCustomerId())
                .amount(paymentRequest.getAmount())
                .paymentMethod(paymentRequest.getPaymentMethod())
                .currency(paymentRequest.getCurrency())
                .build();
        return this.toCustomerPaymentResponse(customerPaymentRepository.save(payment));

    }

    @Override
    public CustomerPaymentResponse update(Long id, CustomerPaymentRequest paymentRequest) {

        CustomerPayment payment = customerPaymentRepository.findById(id).orElseThrow(() -> new CustomerPaymentNotFoundException(id));
        payment.setPaymentDate(LocalDate.now());
        payment.setTravelId(paymentRequest.getTravelId());
        payment.setCustomerId(paymentRequest.getCustomerId());
        payment.setAmount(paymentRequest.getAmount());
        payment.setCurrency(paymentRequest.getCurrency());
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        return this.toCustomerPaymentResponse(customerPaymentRepository.save(payment));
    }

    @Override
    public String delete(Long id) {
        customerPaymentRepository.deleteById(id);
        return "Customer payment deleted successfully";
    }

    public CustomerPaymentResponse toCustomerPaymentResponse(CustomerPayment payment) {

        return CustomerPaymentResponse.builder()
                .id(payment.getId())
                .customerId(payment.getCustomerId())
                .travelId(payment.getTravelId())
                .amount(payment.getAmount())
                .paymentDate(payment.getPaymentDate())
                .currency(payment.getCurrency())
                .paymentMethod(payment.getPaymentMethod())
                .build();
    }

    @Override
    public List<CustomerPaymentResponse> getAllByCustomerIdAndTravelId(Long customerId, Long travelId) {
        return customerPaymentRepository.findAllByCustomerIdAndTravelId(customerId, travelId).stream()
                .map(this::toCustomerPaymentResponse).sorted(Comparator.comparing(CustomerPaymentResponse::getPaymentDate)).toList();
    }

    @Override
    public List<CustomerPayment> getAllByTravelId(Long travelId) {
        return customerPaymentRepository.findAllByTravelId(travelId);
    }
}
