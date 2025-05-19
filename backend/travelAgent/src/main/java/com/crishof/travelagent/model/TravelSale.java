package com.crishof.travelagent.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "tbl_travel_sale")
public class TravelSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long agentId;
    private Long customerId;
    private LocalDate creationDate;
    private LocalDate travelDate;
    private BigDecimal amount;
    private String currency;
    private String description;

    @OneToMany
    @JoinTable(
            name = "tbl_travel_sale_services",
            joinColumns = @JoinColumn(name = "travel_sale_id"),
            inverseJoinColumns = @JoinColumn(name = "services_id")
    )
    private List<Booking> services;
}
