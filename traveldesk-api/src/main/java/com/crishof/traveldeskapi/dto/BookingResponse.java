package com.crishof.traveldeskapi.dto;

import java.time.LocalDate;
import java.util.UUID;

public record BookingResponse(
        UUID id,
        UUID customerId,
        String customerName,
        UUID providerId,
        String providerName,
        String reference,
        String passengerName,
        String destination,
        LocalDate departureDate,
        LocalDate returnDate,
        String status
) {
}
