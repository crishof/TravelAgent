package com.crishof.traveldeskapi.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SaleResponse(
        UUID id,
        String clientName,
        String destination,
        BigDecimal amount,
        String status
) {
}
