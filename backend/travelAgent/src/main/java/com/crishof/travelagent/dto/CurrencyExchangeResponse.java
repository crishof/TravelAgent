package com.crishof.travelagent.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CurrencyExchangeResponse {

    private BigDecimal exchangeRate;
    private BigDecimal amountInSaleCurrency;
}
