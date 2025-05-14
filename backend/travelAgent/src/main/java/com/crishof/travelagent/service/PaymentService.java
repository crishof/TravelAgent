package com.crishof.travelagent.service;


import com.crishof.travelagent.dto.PaymentRequest;
import com.crishof.travelagent.dto.PaymentResponse;

import java.util.List;

public interface PaymentService {

    List<PaymentResponse> getAll();

    PaymentResponse getById(Long id);

    PaymentResponse create(PaymentRequest paymentRequest);

    PaymentResponse update(Long id, PaymentRequest paymentRequest);

    String delete(Long id);
}
