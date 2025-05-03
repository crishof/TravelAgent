package com.crishof.travelagent.dto;

import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TravelSaleResponse {

    private Long id;

    private Long agentId;
    private CustomerResponse customerResponse;
    private LocalDate creationDate;
    private LocalDate travelDate;
    private double amount;
    private String currency;
    private String description;

    @OneToMany
    private List<BookingResponse> services;
}
