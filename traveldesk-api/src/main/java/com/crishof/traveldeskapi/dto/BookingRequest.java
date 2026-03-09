package com.crishof.traveldeskapi.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record BookingRequest(
        @NotBlank(message = "Reference is required")
        @Size(max = 50, message = "Reference must not exceed 50 characters")
        String reference,

        @NotBlank(message = "Passenger name is required")
        @Size(max = 120, message = "Passenger name must not exceed 120 characters")
        String passengerName,

        @NotBlank(message = "Destination is required")
        @Size(max = 120, message = "Destination must not exceed 120 characters")
        String destination,

        @NotBlank(message = "Status is required")
        @Size(max = 30, message = "Status must not exceed 30 characters")
        String status
) {
}
