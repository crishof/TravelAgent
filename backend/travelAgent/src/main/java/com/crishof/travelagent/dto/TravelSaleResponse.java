package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelSaleResponse {

    private Long id;

    private CustomerResponse customerResponse;
    private LocalDate creationDate;
    private LocalDate travelDate;
    private BigDecimal amount;
    private String currency;
    private String description;
    private UserResponse userResponse;

    private List<BookingResponse> services;
}
