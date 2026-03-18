package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.service.ExchangeRateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/exchange-rate")
@RequiredArgsConstructor
@Slf4j
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    //  ===============
    //  GET EXCHANGE RATE
    //  ===============

    @GetMapping
    public ResponseEntity<BigDecimal> convert(@RequestParam String from, @RequestParam String to) {
        log.info("Converting {} to {}", from, to);
        return ResponseEntity.ok(exchangeRateService.getExchangeRateSync(from, to));
    }

    @GetMapping("/sync")
    public ResponseEntity<BigDecimal> convertSync(@RequestParam String from, @RequestParam String to) {
        return ResponseEntity.ok(exchangeRateService.getExchangeRateSync(from, to));
    }
}