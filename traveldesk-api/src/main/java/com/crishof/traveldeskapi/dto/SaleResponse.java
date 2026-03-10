package com.crishof.traveldeskapi.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record SaleResponse(
        UUID id,
        UUID customerId,
        String customerName,
        UUID supplierId,
        String supplierName,
        String destination,
        BigDecimal amount,
        String status
) {
}
