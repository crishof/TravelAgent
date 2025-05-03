package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.dto.TravelSaleResponse;

import java.util.List;

public interface TravelSaleService {

    List<TravelSaleResponse> getAll();

    TravelSaleResponse getById(Long id);

    TravelSaleResponse create(TravelSaleRequest travelSaleRequest);

    TravelSaleResponse update(Long id, TravelSaleRequest travelSaleRequest);

    String delete(Long id);
}
