package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CurrencyExchangeResponse {
    private String from;
    private String to;
    private BigDecimal exchangeRate;
    private BigDecimal amountInSaleCurrency;
}