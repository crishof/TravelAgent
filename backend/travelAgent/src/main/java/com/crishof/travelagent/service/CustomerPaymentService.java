package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerPaymentRequest;
import com.crishof.travelagent.model.CustomerPayment;

import java.util.List;

public interface CustomerPaymentService {

    List<CustomerPayment> getAll();

    CustomerPayment getById(Long id);

    CustomerPayment create(CustomerPaymentRequest paymentRequest);

    CustomerPayment update(Long id, CustomerPaymentRequest paymentRequest);

    String delete(Long id);

    List<CustomerPayment> getAllByCustomerIdAndTravelId(Long customerId, Long travelId);

    List<CustomerPayment> getAllByTravelId(Long travelId);
}
