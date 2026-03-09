package com.crishof.traveldeskapi.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SaleResponse(
        UUID id,
        UUID customerId,
        String customerName,
        UUID providerId,
        String providerName,
        String destination,
        BigDecimal amount,
        String status
) {
}
