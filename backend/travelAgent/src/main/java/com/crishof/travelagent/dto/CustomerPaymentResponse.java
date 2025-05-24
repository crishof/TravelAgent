package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomerPaymentResponse {

    private Long id;

    private Long customerId;
    private Long travelId;
    private BigDecimal amount;
    private String currency;
    private LocalDate paymentDate;
    private String paymentMethod;
    private BigDecimal amountInSaleCurrency;
    private BigDecimal exchangeRate;
}
