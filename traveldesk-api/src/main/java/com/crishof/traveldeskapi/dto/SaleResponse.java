package com.crishof.traveldeskapi.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record SaleResponse(
        UUID id,
        UUID customerId,
        String customerName,
        String destination,
        BigDecimal amount,
        String status,
        BigDecimal paidAmount,
        Instant departureDate
) {
}
