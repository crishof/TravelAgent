package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.dto.TravelSaleResponse;
import com.crishof.travelagent.exception.BookingNotFoundException;
import com.crishof.travelagent.exception.TravelSaleNotFoundException;
import com.crishof.travelagent.model.Booking;
import com.crishof.travelagent.model.CustomerPayment;
import com.crishof.travelagent.model.TravelSale;
import com.crishof.travelagent.repository.TravelSaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class TravelSaleServiceImpl implements TravelSaleService {
    private final TravelSaleRepository travelSaleRepository;
    private final BookingService bookingService;
    private final CustomerService customerService;
    private final CustomerPaymentService customerPaymentService;

    @Override
    public List<TravelSaleResponse> getAll() {

        return travelSaleRepository.findAll().stream()
                .sorted(Comparator.comparing(
                        TravelSale::getTravelDate,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ))
                .map(this::toTravelSaleResponse)
                .toList();
    }

    @Override
    public TravelSaleResponse getById(Long id) {

        TravelSale sale = travelSaleRepository.findById(id).orElseThrow(() -> new TravelSaleNotFoundException(id));
        return this.toTravelSaleResponse(sale);
    }

    @Override
    public List<TravelSaleResponse> getAllByCustomerId(Long customerId) {

        return travelSaleRepository.findAllByCustomerId(customerId).stream()
                .sorted(Comparator.comparing(TravelSale::getTravelDate).reversed())
                .map(this::toTravelSaleResponse)
                .toList();
    }

    @Override
    public TravelSaleResponse create(TravelSaleRequest request) {
        TravelSale sale = new TravelSale();
        Long customerId = customerService.getIdFromNewSale(request.getCustomer());
        applyRequestToSale(sale, request, true, customerId);
        return this.toTravelSaleResponse(travelSaleRepository.save(sale));
    }

    @Override
    public TravelSaleResponse update(Long id, TravelSaleRequest request) {
        TravelSale sale = travelSaleRepository.findById(id)
                .orElseThrow(() -> new TravelSaleNotFoundException(id));
        applyRequestToSale(sale, request, false, id);
        return this.toTravelSaleResponse(travelSaleRepository.save(sale));
    }

    @Override
    public String delete(Long id) {
        TravelSale sale = travelSaleRepository.findById(id).orElseThrow(() -> new TravelSaleNotFoundException(id));
        travelSaleRepository.delete(sale);
        return "Travel Sale with id " + id + " successfully deleted";
    }

    @Override
    public BigDecimal getTravelFee(Long id) {
        TravelSale travelSale = travelSaleRepository.findById(id)
                .orElseThrow(() -> new TravelSaleNotFoundException(id));

        BigDecimal totalPayments = BigDecimal.ZERO;
        BigDecimal totalBookings = BigDecimal.ZERO;

        List<CustomerPayment> payments = customerPaymentService.getAllByTravelId(id);
        for (CustomerPayment payment : payments) {
            totalPayments = totalPayments.add(payment.getAmountInSaleCurrency());
        }

        for (Booking booking : travelSale.getServices()) {

            if (booking.isPaid()) {
                totalBookings = totalBookings.add(booking.getAmountInSaleCurrency());
            }
        }

        return totalPayments.subtract(totalBookings);
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
        travelSaleResponse.setCustomerResponse(customerService.getById(travelSale.getCustomerId()));
        travelSaleResponse.setCreationDate(travelSale.getCreationDate());
        return travelSaleResponse;
    }

    private void applyRequestToSale(TravelSale sale, TravelSaleRequest request, boolean isNew, long customerId) {

//      TODO  sale.setAgentId(request.getAgentId());

        sale.setAgentId(ThreadLocalRandom.current().nextLong(1, 4));
        sale.setCustomerId(customerId);
        sale.setTravelDate(request.getTravelDate());
        sale.setDescription(request.getDescription());
        sale.setAmount(request.getAmount());
        sale.setCurrency(request.getCurrency());

        if (isNew) {

            sale.setCreationDate(LocalDate.now());
            sale.setServices(
                    request.getServices().stream()
                            .map(service -> bookingService.createEntity(service, sale.getCurrency()))
                            .toList()
            );
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

                    Booking newBooking = bookingService.createEntity(req, sale.getCurrency());
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
