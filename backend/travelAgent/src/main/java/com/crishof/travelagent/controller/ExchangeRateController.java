package com.crishof.travelagent.controller;

import com.crishof.travelagent.service.CurrencyConversionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/exchange-rate")
@RequiredArgsConstructor
public class ExchangeRateController {

    private final CurrencyConversionService currencyConversionService;

    @GetMapping("/get")
    public Mono<BigDecimal> convert(
            @RequestParam String from,
            @RequestParam String to) {
        return currencyConversionService.getExchangeRate(from, to);
    }

    @GetMapping("/getSync")
    public ResponseEntity<BigDecimal> convertSync(
            @RequestParam String from,
            @RequestParam String to) {
        return ResponseEntity.ok(currencyConversionService.getExchangeRateSync(from, to));
    }
}