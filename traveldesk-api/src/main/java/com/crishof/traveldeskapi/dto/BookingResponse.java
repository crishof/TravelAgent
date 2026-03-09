package com.crishof.traveldeskapi.dto;

import java.util.UUID;

public record BookingResponse(
        UUID id,
        String reference,
        String passengerName,
        String destination,
        String status
) {
}
