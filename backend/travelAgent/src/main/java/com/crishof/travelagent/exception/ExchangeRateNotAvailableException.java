package com.crishof.travelagent.exception;

public class ExchangeRateNotAvailableException extends RuntimeException {
    public ExchangeRateNotAvailableException(String sourceCurrency, String targetCurrency) {
        super("No exchange rate available from " + sourceCurrency + " to " + targetCurrency);
    }
}