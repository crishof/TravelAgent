package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerPaymentRequest;
import com.crishof.travelagent.dto.CustomerPaymentResponse;

import java.util.List;

public interface CustomerPaymentService {

    List<CustomerPaymentResponse> getAll();

    CustomerPaymentResponse getById(Long id);

    CustomerPaymentResponse create(CustomerPaymentRequest paymentRequest);

    CustomerPaymentResponse update(Long id, CustomerPaymentRequest paymentRequest);

    String delete(Long id);

    List<CustomerPaymentResponse> getAllByCustomerIdAndTravelId(Long customerId, Long travelId);
}
