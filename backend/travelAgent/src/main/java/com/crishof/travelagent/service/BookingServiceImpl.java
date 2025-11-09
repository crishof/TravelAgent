package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.CurrencyExchangeResponse;
import com.crishof.travelagent.dto.TopSupplierDTO;
import com.crishof.travelagent.exception.BookingNotFoundException;
import com.crishof.travelagent.exception.ExchangeRateNotAvailableException;
import com.crishof.travelagent.mapper.BookingMapper;
import com.crishof.travelagent.model.Agency;
import com.crishof.travelagent.model.Booking;
import com.crishof.travelagent.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CurrencyConversionService currencyConversionService;
    private final UserService userService;
    private final BookingMapper bookingMapper;
    private final SupplierService supplierService;


    @Override
    @Transactional(readOnly = true)
    public List<Booking> getAll() {
        Agency agency = userService.getCurrentUser().getAgency();
        List<Booking> bookings = bookingRepository.findAllByAgency(agency);
        return bookings.stream().sorted(Comparator.comparing(Booking::getReservationDate)).toList();
    }

    @Override
    public Booking getById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id));
    }

    @Override
    public Booking createEntity(BookingRequest bookingRequest, String saleCurrency) {

        Booking booking = bookingMapper.toEntity(bookingRequest);

        // Calcular conversión
        if (bookingRequest.getCurrency().equals(saleCurrency)) {
            booking.setExchangeRate(BigDecimal.ONE);
            booking.setAmountInSaleCurrency(bookingRequest.getAmount());
        } else {
            CurrencyExchangeResponse currencyExchangeResponse =
                    this.toCurrencyExchangeResponse(bookingRequest.getCurrency(), bookingRequest.getAmount());

            booking.setExchangeRate(currencyExchangeResponse.getExchangeRate());
            booking.setAmountInSaleCurrency(currencyExchangeResponse.getAmountInSaleCurrency());
        }

        // Set usuario y agencia actual
        booking.setCreatedBy(userService.getCurrentUser());
        booking.setAgency(userService.getCurrentUser().getAgency());

        // Set proveedor
        booking.setSupplier(supplierService.getById(bookingRequest.getSupplierId()));

        booking.setBookingDate(LocalDate.now());

        return booking; // ❗ No se persiste aquí
    }

    @Override
    public Booking createAndSave(BookingRequest bookingRequest, String saleCurrency) {
        Booking booking = createEntity(bookingRequest, saleCurrency);
        return bookingRepository.save(booking);
    }

    @Override
    public Booking update(Long id, BookingRequest bookingRequest) {

        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id));
        bookingMapper.updateEntityFromRequest(bookingRequest, booking);

        return bookingRepository.save(booking);

    }

    private CurrencyExchangeResponse toCurrencyExchangeResponse(String sourceCurrency, BigDecimal amount) {

        CurrencyExchangeResponse currencyExchangeResponse = new CurrencyExchangeResponse();
        String targetCurrency = "USD".equals(sourceCurrency) ? "EUR" : "USD";
        BigDecimal exchangeRate = currencyConversionService.getExchangeRate(sourceCurrency, targetCurrency)
                .blockOptional()
                .orElseThrow(() -> new ExchangeRateNotAvailableException(sourceCurrency, targetCurrency));

        BigDecimal amountInSaleCurrency = amount.multiply(exchangeRate);

        currencyExchangeResponse.setAmountInSaleCurrency(amountInSaleCurrency);
        currencyExchangeResponse.setExchangeRate(exchangeRate);

        return currencyExchangeResponse;
    }

    @Override
    public String delete(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id));

        if (booking.getSale() != null && booking.isPaid()) {
            throw new IllegalStateException("Cannot delete a booking that is already paid.");
        }

        booking.setActive(false);
        bookingRepository.save(booking);

        return "Booking with id: " + id + " marked as inactive";
    }

    @Override
    public void payBooking(Long bookingId, boolean paid) {

        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new BookingNotFoundException(bookingId));
        booking.setPaid(paid);
    }

    @Override
    public List<Booking> findAllByBookingNumber(String searchTerm) {
        return bookingRepository.findAllByBookingNumber(searchTerm);
    }

    @Override
    public CurrencyExchangeResponse getCurrencyConversion(String fromCurrency, String toCurrency, BigDecimal amount) {
        BigDecimal exchangeRate = currencyConversionService
                .getExchangeRate(fromCurrency, toCurrency)
                .block(); // Bloqueamos porque estamos en código síncrono

        if (exchangeRate == null || exchangeRate.compareTo(BigDecimal.ZERO) == 0) {
            throw new IllegalStateException("Failed to retrieve exchange rate.");
        }

        BigDecimal amountInSaleCurrency = amount.multiply(exchangeRate);
        return new CurrencyExchangeResponse(
                fromCurrency, toCurrency,
                exchangeRate,
                amountInSaleCurrency
        );
    }

    @Override
    public List<TopSupplierDTO> getTopSuppliers() {
        return bookingRepository.findTopSuppliers().stream()
                .limit(5).toList();
    }
}
