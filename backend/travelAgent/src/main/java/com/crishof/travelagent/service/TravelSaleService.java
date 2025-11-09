package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.MonthlySalesDTO;
import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.model.TravelSale;

import java.math.BigDecimal;
import java.util.List;

public interface TravelSaleService {

    List<TravelSale> getAll();

    TravelSale getById(Long id);

    TravelSale create(TravelSaleRequest travelSaleRequest);

    TravelSale update(Long id, TravelSaleRequest travelSaleRequest);

    String delete(Long id);

    List<TravelSale> getAllByCustomerId(Long customerId);

    BigDecimal getTravelFee(Long id);

    List<MonthlySalesDTO> getSalesByMonth();

    Double getTotalSales();

    Double getTotalPendingPayments();
}
