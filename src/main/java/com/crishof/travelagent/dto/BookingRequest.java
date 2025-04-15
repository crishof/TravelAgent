package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    private LocalDate bookingDate;
    private LocalDate reservationDate;
    private String description;
    private Double amount;
    private String currency;

}
