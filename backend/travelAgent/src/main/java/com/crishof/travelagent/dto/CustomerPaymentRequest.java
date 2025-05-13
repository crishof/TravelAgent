package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPaymentRequest {

    private Long id;

    private Long customerId;
    private Long travelId;
    private double amount;
    private String currency;
    private String paymentMethod;

}
