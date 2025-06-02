package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CurrencyLatestResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class CurrencyConversionService {

    private final WebClient webClient;
    private final String apiKey;

    public CurrencyConversionService(
            WebClient.Builder webClientBuilder,
            @Value("${FREE_CURRENCY_APIKEY}") String apiKey
    ) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.freecurrencyapi.com/v1")
                .build();
        this.apiKey = apiKey;
    }

    public Mono<BigDecimal> getExchangeRate(String from, String to) {

        if (apiKey == null) {
            throw new IllegalStateException("API key for currency conversion is missing.");
        }

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/latest")
                        .queryParam("apikey", apiKey)
                        .queryParam("base_currency", from)
                        .queryParam("currencies", to)
                        .build())
                .retrieve()
                .bodyToMono(CurrencyLatestResponse.class)
                .map(response -> {
                    Map<String, BigDecimal> data = response.getData();
                    return data.getOrDefault(to, BigDecimal.ZERO);
                });
    }

    public BigDecimal getExchangeRateSync(String from, String to) {
        return getExchangeRate(from, to).block();
    }
}