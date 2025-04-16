package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.dto.TravelSaleResponse;
import com.crishof.travelagent.exception.TravelSaleNotFoundException;
import com.crishof.travelagent.model.TravelSale;
import com.crishof.travelagent.repository.TravelSaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TravelSaleServiceImpl implements TravelSaleService {
    private final TravelSaleRepository travelSaleRepository;

    @Override
    public List<TravelSaleResponse> getAll() {
        List<TravelSale> sales = travelSaleRepository.findAll();
        return sales.stream()
                .map(this::toTravelSaleResponse)
                .toList();
    }

    @Override
    public TravelSaleResponse getById(long id) {

        TravelSale sale = travelSaleRepository.findById(id).orElseThrow(() -> new TravelSaleNotFoundException(id));
        return this.toTravelSaleResponse(sale);
    }

    @Override
    public TravelSaleResponse create(TravelSaleRequest travelSaleRequest) {

        TravelSale sale = new TravelSale();

        sale.setAgentId(travelSaleRequest.getAgentId());
        sale.setCreationDate(travelSaleRequest.getCreationDate());
        sale.setTravelDate(travelSaleRequest.getTravelDate());
        sale.setAmount(travelSaleRequest.getAmount());
        sale.setCurrency(travelSaleRequest.getCurrency());
        sale.setDescription(travelSaleRequest.getDescription());
        sale.setServices(travelSaleRequest.getServices());

        return this.toTravelSaleResponse(this.travelSaleRepository.save(sale));
    }

    @Override
    public TravelSaleResponse update(long id, TravelSaleRequest travelSaleRequest) {
        TravelSale travelSale = travelSaleRepository.findById(id).orElseThrow(() -> new TravelSaleNotFoundException(id));
        travelSale.setAgentId(travelSaleRequest.getAgentId());
        travelSale.setCreationDate(travelSaleRequest.getCreationDate());
        travelSale.setTravelDate(travelSaleRequest.getTravelDate());
        travelSale.setAmount(travelSaleRequest.getAmount());
        travelSale.setCurrency(travelSaleRequest.getCurrency());
        travelSale.setDescription(travelSaleRequest.getDescription());
        travelSale.setServices(travelSaleRequest.getServices());
        return this.toTravelSaleResponse(this.travelSaleRepository.save(travelSale));
    }

    @Override
    public String delete(long id) {
        TravelSale sale = travelSaleRepository.findById(id).orElseThrow(() -> new TravelSaleNotFoundException(id));
        travelSaleRepository.delete(sale);
        return "Travel Sale with id " + id + " successfully deleted";
    }

    private TravelSaleResponse toTravelSaleResponse(TravelSale travelSale) {
        TravelSaleResponse travelSaleResponse = new TravelSaleResponse();

        travelSaleResponse.setId(travelSale.getId());
        travelSaleResponse.setTravelDate(travelSale.getTravelDate());
        travelSaleResponse.setAmount(travelSale.getAmount());
        travelSaleResponse.setServices(travelSale.getServices());
        travelSaleResponse.setCurrency(travelSale.getCurrency());
        travelSaleResponse.setDescription(travelSale.getDescription());
        travelSaleResponse.setAgentId(travelSale.getAgentId());
        return travelSaleResponse;
    }
}
