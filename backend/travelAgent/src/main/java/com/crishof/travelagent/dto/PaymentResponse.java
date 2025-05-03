package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PaymentResponse {

    Long id;

    Long bookingId;
    Long customerId;
    LocalDate paymentDate;
    double amount;
    String currency;
}
