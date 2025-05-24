package com.crishof.travelagent.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Map;

@Data
public class CurrencyLatestResponse {
    private Map<String, BigDecimal> data;
}
