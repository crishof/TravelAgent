package com.crishof.travelagent.service;


import com.crishof.travelagent.dto.PaymentRequest;
import com.crishof.travelagent.dto.PaymentResponse;

import java.util.List;

public interface PaymentService {

    List<PaymentResponse> getAll();

    PaymentResponse getById(long id);

    PaymentResponse create(PaymentRequest paymentRequest);

    PaymentResponse update(long id, PaymentRequest paymentRequest);

    String delete(long id);
}
