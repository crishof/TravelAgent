package com.crishof.travelagent.service;


import com.crishof.travelagent.dto.PaymentRequest;
import com.crishof.travelagent.model.Payment;

import java.math.BigDecimal;
import java.util.List;

public interface PaymentService {

    List<Payment> getAll();

    Payment getById(Long id);

    Payment create(PaymentRequest paymentRequest);

    Payment update(Long id, PaymentRequest paymentRequest);

    String delete(Long id);

    void createFromBooking(Long id, BigDecimal amount, String currency);
}
