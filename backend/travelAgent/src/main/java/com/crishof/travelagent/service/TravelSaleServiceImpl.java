package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.CurrencyExchangeResponse;
import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.exception.BookingNotFoundException;
import com.crishof.travelagent.exception.TravelSaleNotFoundException;
import com.crishof.travelagent.mapper.TravelSaleMapper;
import com.crishof.travelagent.model.*;
import com.crishof.travelagent.repository.TravelSaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class TravelSaleServiceImpl implements TravelSaleService {
    private final TravelSaleRepository travelSaleRepository;
    private final BookingService bookingService;
    private final CustomerService customerService;
    private final CustomerPaymentService customerPaymentService;
    private final UserService userService;
    private final TravelSaleMapper travelSaleMapper;
    private final SupplierService supplierService;

    @Override
    @Transactional(readOnly = true)
    public List<TravelSale> getAll() {

        return travelSaleRepository.findAllByAgency(userService.getCurrentUser().getAgency()).stream()
                .sorted(Comparator.comparing(
                        TravelSale::getTravelDate,
                        Comparator.nullsLast(Comparator.naturalOrder())
                ))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TravelSale getById(Long id) {
        return travelSaleRepository.findById(id).orElseThrow(() -> new TravelSaleNotFoundException(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TravelSale> getAllByCustomerId(Long customerId) {

        User currentUser = userService.getCurrentUser();
        Long agencyId = currentUser.getAgency().getId();

        return travelSaleRepository.findAllByCustomerIdAndAgencyId(customerId, agencyId).stream()
                .sorted(Comparator.comparing(TravelSale::getTravelDate).reversed())
                .toList();
    }

    @Override
    public TravelSale create(TravelSaleRequest request) {
        User currentUser = userService.getCurrentUser();
        Customer customer = customerService.create(request.getCustomer());

        TravelSale sale = travelSaleMapper.toEntity(request);
        sale.setCustomer(customer);
        sale.setUser(currentUser);
        sale.setAgency(currentUser.getAgency());
        sale.setCreationDate(LocalDate.now());

        List<Booking> services = request.getServices().stream()
                .map(req -> {
                    Booking booking = bookingService.createEntity(req, sale.getCurrency());
                    booking.setSale(sale); // setea la relación con la venta
                    booking.setActive(true);
                    return booking;
                })
                .toList();

        sale.setServices(services);

        return travelSaleRepository.save(sale); // se guarda en cascade
    }


    @Override
    public TravelSale update(Long id, TravelSaleRequest request) {
        TravelSale sale = travelSaleRepository.findById(id)
                .orElseThrow(() -> new TravelSaleNotFoundException(id));

        User currentUser = userService.getCurrentUser();
        Agency agency = currentUser.getAgency();

        sale.setUser(currentUser);
        sale.setAgency(agency);
        sale.setTravelDate(request.getTravelDate());
        sale.setDescription(request.getDescription());
        sale.setAmount(request.getAmount());
        sale.setCurrency(request.getCurrency());

        List<Booking> updatedServices = new ArrayList<>();

        for (BookingRequest req : request.getServices()) {
            if (req.getId() != null) {
                // Modificar existente
                Booking existing = sale.getServices().stream()
                        .filter(b -> b.getId().equals(req.getId()))
                        .findFirst()
                        .orElseThrow(() -> new BookingNotFoundException(req.getId()));

                existing.setSupplier(supplierService.getById(req.getSupplierId()));
                existing.setBookingNumber(req.getBookingNumber());
                existing.setReservationDate(req.getReservationDate());
                existing.setDescription(req.getDescription());
                existing.setAmount(req.getAmount());
                existing.setCurrency(req.getCurrency());
                // Recalcular importe en moneda de la venta si cambia
                if (!req.getCurrency().equals(sale.getCurrency())) {
                    CurrencyExchangeResponse conversion = bookingService.getCurrencyConversion(
                            req.getCurrency(),
                            sale.getCurrency(),
                            req.getAmount()
                    );
                    existing.setExchangeRate(conversion.getExchangeRate());
                    existing.setAmountInSaleCurrency(conversion.getAmountInSaleCurrency());
                } else {
                    existing.setExchangeRate(BigDecimal.ONE);
                    existing.setAmountInSaleCurrency(req.getAmount());
                }

                updatedServices.add(existing);

            } else {
                // Crear nuevo booking
                Booking newBooking = bookingService.createEntity(req, sale.getCurrency());
                newBooking.setSale(sale);
                newBooking.setAgency(agency);
                newBooking.setCreatedBy(currentUser);
                newBooking.setActive(true);
                updatedServices.add(newBooking);
            }
        }

        // Eliminar bookings que ya no están en el request
        List<Long> incomingIds = request.getServices().stream()
                .map(BookingRequest::getId)
                .filter(Objects::nonNull)
                .toList();

        List<Booking> toRemove = sale.getServices().stream()
                .filter(b -> !incomingIds.contains(b.getId()))
                .toList();

        sale.getServices().removeAll(toRemove);
        sale.setServices(updatedServices);

        return travelSaleRepository.save(sale);
    }

    @Override
    public String delete(Long id) {
        TravelSale sale = travelSaleRepository.findById(id).orElseThrow(() -> new TravelSaleNotFoundException(id));
        travelSaleRepository.delete(sale);
        return "Travel Sale with id " + id + " successfully deleted";
    }

    @Override
    @Transactional(readOnly = true)
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
}

