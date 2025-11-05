package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    private Long id;
    private Long supplierId;
    private String bookingNumber;
    private LocalDate reservationDate;
    private String description;
    private BigDecimal amount;
    private String currency;
    private boolean paid;
    private BigDecimal exchangeRate;
    private BigDecimal amountInSaleCurrency;
    private String saleCurrency;
    private Long saleId;

}
