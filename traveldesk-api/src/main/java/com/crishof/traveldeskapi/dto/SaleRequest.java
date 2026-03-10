package com.crishof.traveldeskapi.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public record SaleRequest(
        @NotNull(message = "Customer id is required")
        UUID customerId,

        UUID supplierId,

        @NotBlank(message = "Destination is required")
        @Size(max = 120, message = "Destination must not exceed 120 characters")
        String destination,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "Amount must be greater than zero")
        BigDecimal amount,

        @NotBlank(message = "Status is required")
        @Size(max = 30, message = "Status must not exceed 30 characters")
        String status
) {
}
