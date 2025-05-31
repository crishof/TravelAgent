package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PaymentResponse {

    Long id;
    String currency;
    private Long bookingId;
    private Long customerId;
    private LocalDate paymentDate;
    private BigDecimal amount;
    private String description;
}
