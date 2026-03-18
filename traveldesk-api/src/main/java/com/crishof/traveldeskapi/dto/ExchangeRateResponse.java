package com.crishof.traveldeskapi.dto;

import java.math.BigDecimal;

public record ExchangeRateResponse(
        String baseCurrency,
        String targetCurrency,
        BigDecimal rate
) {
}
