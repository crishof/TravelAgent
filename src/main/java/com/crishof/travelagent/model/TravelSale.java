package com.crishof.travelagent.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table (name = "tbl_travel_sale")
public class TravelSale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long agentId;
    private LocalDate creationDate;
    private LocalDate travelDate;
    private double amount;
    private String currency;
    private String description;

    @OneToMany
    private ArrayList<SupplierSettlement> services;

}
