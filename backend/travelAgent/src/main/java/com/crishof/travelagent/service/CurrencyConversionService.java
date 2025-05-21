package com.crishof.travelagent.service;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class CurrencyConversionService {

    private final WebClient webClient;
    private final Dotenv dotenv;

    public CurrencyConversionService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.freecurrencyapi.com/v1")
                .build();
        this.dotenv = Dotenv.load();
    }

    public Mono<BigDecimal> getExchangeRate(String from, String to) {
        String apiKey = dotenv.get("FREE_CURRENCY_APIKEY");

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

    // opción sincrónica si la necesitas:
    public BigDecimal getExchangeRateSync(String from, String to) {
        return getExchangeRate(from, to).block(); // usar con precaución fuera de entornos reactivos
    }
}