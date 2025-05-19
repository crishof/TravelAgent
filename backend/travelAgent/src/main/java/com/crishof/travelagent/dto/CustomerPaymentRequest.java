package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPaymentRequest {

    private Long id;

    private Long customerId;
    private Long travelId;
    private BigDecimal amount;
    private String currency;
    private String paymentMethod;

}
