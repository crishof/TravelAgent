package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.dto.TravelSaleResponse;

import java.util.List;

public interface TravelSaleService {

    List<TravelSaleResponse> getAll();

    TravelSaleResponse getById(long id);

    TravelSaleResponse create(TravelSaleRequest travelSaleRequest);

    TravelSaleResponse update(long id, TravelSaleRequest travelSaleRequest);

    String delete(long id);
}
