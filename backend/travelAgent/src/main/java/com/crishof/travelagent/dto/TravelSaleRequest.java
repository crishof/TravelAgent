package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelSaleRequest {

    private LocalDate creationDate;
    private LocalDate travelDate;
    private BigDecimal amount;
    private String currency;
    private String description;
    private CustomerRequest customer;

    private List<BookingRequest> services;
}
