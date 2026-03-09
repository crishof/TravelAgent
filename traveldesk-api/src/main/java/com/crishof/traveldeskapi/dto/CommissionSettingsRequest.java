package com.crishof.traveldeskapi.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CommissionSettingsRequest(
        @NotBlank(message = "Commission type is required")
        @Size(max = 30, message = "Commission type must not exceed 30 characters")
        String commissionType,

        @NotNull(message = "Commission value is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Commission value must be greater than or equal to zero")
        BigDecimal commissionValue
) {
}
