package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CurrencyLatestResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.util.Map;

@Service
public class CurrencyConversionService {

    private static final Logger logger = LoggerFactory.getLogger(CurrencyConversionService.class);
    private final WebClient webClient;

    public CurrencyConversionService() {
        logger.info("Inicializando CurrencyConversionService...");

        this.webClient = WebClient.builder()
                .baseUrl("https://api.freecurrencyapi.com/v1")
                .build();

        try {

            String apiKey = System.getenv("FREE_CURRENCY_APIKEY");
            if (apiKey == null || apiKey.isBlank()) {
                logger.error("❌ FREE_CURRENCY_APIKEY no está definida en el entorno.");
                throw new IllegalStateException("FREE_CURRENCY_APIKEY es obligatoria.");
            } else {
                logger.info("✅ FREE_CURRENCY_APIKEY encontrada correctamente.");
            }
        } catch (Exception e) {
            logger.error("Error al inicializar CurrencyConversionService", e);
            throw e; // Relanzado para ver en Railway
        }
    }

    public Mono<BigDecimal> getExchangeRate(String from, String to) {
        String apiKey = System.getenv("FREE_CURRENCY_APIKEY");

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