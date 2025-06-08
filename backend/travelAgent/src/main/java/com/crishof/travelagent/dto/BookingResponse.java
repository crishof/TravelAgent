package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingResponse {

    private Long id;

    private Long supplierId;
    private String bookingNumber;
    private LocalDate bookingDate;
    private LocalDate reservationDate;
    private String description;
    private BigDecimal amount;
    private String currency;
    private BigDecimal exchangeRate;
    private BigDecimal amountInSaleCurrency;
    private boolean paid;
    private Long saleId;
}
