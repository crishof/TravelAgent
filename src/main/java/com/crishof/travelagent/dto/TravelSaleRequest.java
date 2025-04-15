package com.crishof.travelagent.dto;

import com.crishof.travelagent.model.Booking;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TravelSaleRequest {

    private Long agentId;
    private LocalDate creationDate;
    private LocalDate travelDate;
    private double amount;
    private String currency;
    private String description;

    @OneToMany
    private ArrayList<Booking> services;
}
