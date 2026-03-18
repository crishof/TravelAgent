package com.crishof.traveldeskapi.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tbl_exchange_rates")
public class ExchangeRate {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 10)
    private String baseCurrency;

    @Column(nullable = false, length = 10)
    private String targetCurrency;

    @Column(nullable = false, precision = 12, scale = 4)
    private BigDecimal rate;

    @Column(nullable = false)
    private Instant fetchedAt;

    @PrePersist
    void onCreate() {
        if (fetchedAt == null) {
            fetchedAt = Instant.now();
        }
    }
}
