package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.dto.ExchangeRateResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/exchange-rate")
@RequiredArgsConstructor
@Slf4j
public class ExchangeRateController {

    //  ===============
    //  GET EXCHANGE RATE
    //  ===============

    @Operation(summary = "Get exchange rate")
    @ApiResponse(responseCode = "200", description = "Exchange rate retrieved successfully")
    @GetMapping
    public ResponseEntity<ExchangeRateResponse> getExchangeRate() {
        log.info("Get exchange rate request received");
        return ResponseEntity.ok().build();
    }
}