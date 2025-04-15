package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.dto.TravelSaleResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TravelSaleServiceImpl implements TravelSaleService {
    @Override
    public List<TravelSaleResponse> getAll() {
        return List.of();
    }

    @Override
    public TravelSaleResponse getById(long id) {
        return null;
    }

    @Override
    public TravelSaleResponse create(TravelSaleRequest travelSaleRequest) {
        return null;
    }

    @Override
    public String delete(long id) {
        return "";
    }
}
