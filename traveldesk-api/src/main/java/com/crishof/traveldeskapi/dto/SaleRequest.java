package com.crishof.traveldeskapi.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record SaleRequest(
        @NotBlank(message = "Client name is required")
        @Size(max = 120, message = "Client name must not exceed 120 characters")
        String clientName,

        @NotBlank(message = "Destination is required")
        @Size(max = 120, message = "Destination must not exceed 120 characters")
        String destination,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than zero")
        BigDecimal amount
) {
}
