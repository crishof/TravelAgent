package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.dto.TravelSaleResponse;
import com.crishof.travelagent.exception.BookingNotFoundException;
import com.crishof.travelagent.exception.TravelSaleNotFoundException;
import com.crishof.travelagent.model.Booking;
import com.crishof.travelagent.model.TravelSale;
import com.crishof.travelagent.repository.TravelSaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TravelSaleServiceImpl implements TravelSaleService {
    private final TravelSaleRepository travelSaleRepository;
    private final BookingService bookingService;

    @Override
    public List<TravelSaleResponse> getAll() {
        List<TravelSale> sales = travelSaleRepository.findAll();
        return sales.stream().map(this::toTravelSaleResponse).toList();
    }

    @Override
    public TravelSaleResponse getById(long id) {

        TravelSale sale = travelSaleRepository.findById(id).orElseThrow(() -> new TravelSaleNotFoundException(id));
        return this.toTravelSaleResponse(sale);
    }

    @Override
    public TravelSaleResponse create(TravelSaleRequest request) {
        TravelSale sale = new TravelSale();
        applyRequestToSale(sale, request, true);
        return this.toTravelSaleResponse(travelSaleRepository.save(sale));
    }

    @Override
    public TravelSaleResponse update(long id, TravelSaleRequest request) {
        TravelSale sale = travelSaleRepository.findById(id)
                .orElseThrow(() -> new TravelSaleNotFoundException(id));
        applyRequestToSale(sale, request, false);
        return this.toTravelSaleResponse(travelSaleRepository.save(sale));
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
        travelSaleResponse.setServices(travelSale.getServices().stream().map(bookingService::toBookingResponse).toList());
        travelSaleResponse.setCurrency(travelSale.getCurrency());
        travelSaleResponse.setDescription(travelSale.getDescription());
        travelSaleResponse.setAgentId(travelSale.getAgentId());
        travelSaleResponse.setCreationDate(travelSale.getCreationDate());
        return travelSaleResponse;
    }

    private void applyRequestToSale(TravelSale sale, TravelSaleRequest request, boolean isNew) {

        sale.setAgentId(request.getAgentId());
        sale.setTravelDate(request.getTravelDate());
        sale.setDescription(request.getDescription());
        sale.setAmount(request.getAmount());
        sale.setCurrency(request.getCurrency());

        if (isNew) {

            sale.setCreationDate(LocalDate.now());
            sale.setServices(request.getServices().stream()
                    .map(bookingService::createEntity)
                    .toList());
        } else {

            List<Booking> updatedServices = new ArrayList<>();

            for (BookingRequest req : request.getServices()) {

                if (req.getId() != null) {

                    Booking existing = sale.getServices().stream()
                            .filter(b -> b.getId().equals(req.getId()))
                            .findFirst()
                            .orElseThrow(() -> new BookingNotFoundException(req.getId()));

                    existing.setSupplierId(req.getSupplierId());
                    existing.setBookingNumber(req.getBookingNumber());
                    existing.setReservationDate(req.getReservationDate());
                    existing.setDescription(req.getDescription());
                    existing.setAmount(req.getAmount());
                    existing.setCurrency(req.getCurrency());

                    updatedServices.add(existing);

                } else {

                    Booking newBooking = bookingService.createEntity(req);
                    updatedServices.add(newBooking);
                }
            }

            List<Long> incomingIds = request.getServices().stream()
                    .map(BookingRequest::getId)
                    .filter(Objects::nonNull)
                    .toList();

            List<Booking> toRemove = sale.getServices().stream()
                    .filter(b -> !incomingIds.contains(b.getId()))
                    .toList();

            sale.getServices().removeAll(toRemove);

            sale.setServices(updatedServices);
        }
    }
}
