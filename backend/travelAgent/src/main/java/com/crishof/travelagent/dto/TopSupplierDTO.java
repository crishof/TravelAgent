package com.crishof.travelagent.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TopSupplierDTO {
    private String supplierName;
    private Long totalSales;
    private BigDecimal totalAmount;

    public TopSupplierDTO(String name, Long totalSales, Number totalAmount) {
        this.supplierName = name;
        this.totalSales = totalSales;
        this.totalAmount = totalAmount != null ? new BigDecimal(totalAmount.toString()) : BigDecimal.ZERO;
    }
}
