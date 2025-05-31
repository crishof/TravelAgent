package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.dto.CurrencyExchangeResponse;
import com.crishof.travelagent.exception.BookingNotFoundException;
import com.crishof.travelagent.exception.ExchangeRateNotAvailableException;
import com.crishof.travelagent.model.Booking;
import com.crishof.travelagent.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final CurrencyConversionService currencyConversionService;


    @Override
    public List<BookingResponse> getAll() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().sorted(Comparator.comparing(Booking::getReservationDate)).map(this::toBookingResponse).toList();
    }

    @Override
    public BookingResponse getById(Long id) {
        return this.toBookingResponse(bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id)));
    }

    @Override
    public BookingResponse create(BookingRequest bookingRequest, String saleCurrency) {

        if (bookingRequest.getCurrency().equals(saleCurrency)) {

            bookingRequest.setExchangeRate(new BigDecimal(1));
            bookingRequest.setAmountInSaleCurrency(bookingRequest.getAmount());
        }

        CurrencyExchangeResponse currencyExchangeResponse = this.toCurrencyExchangeResponse(bookingRequest.getCurrency(), bookingRequest.getAmount());
        bookingRequest.setExchangeRate(currencyExchangeResponse.getExchangeRate());
        bookingRequest.setAmountInSaleCurrency(currencyExchangeResponse.getAmountInSaleCurrency());


        return this.toBookingResponse(bookingRepository.save(this.toBooking(bookingRequest)));
    }

    @Override
    public Booking createEntity(BookingRequest bookingRequest, String saleCurrency) {

        if (bookingRequest.getCurrency().equals(saleCurrency)) {

            bookingRequest.setExchangeRate(new BigDecimal(1));
            bookingRequest.setAmountInSaleCurrency(bookingRequest.getAmount());

        } else {
            CurrencyExchangeResponse currencyExchangeResponse = this.toCurrencyExchangeResponse(bookingRequest.getCurrency(), bookingRequest.getAmount());
            bookingRequest.setExchangeRate(currencyExchangeResponse.getExchangeRate());
            bookingRequest.setAmountInSaleCurrency(currencyExchangeResponse.getAmountInSaleCurrency());
        }

        return bookingRepository.save(this.toBooking(bookingRequest));
    }

    @Override
    public BookingResponse update(Long id, BookingRequest bookingRequest) {

        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id));

        booking.setBookingNumber(bookingRequest.getBookingNumber());
        booking.setAmount(bookingRequest.getAmount());
        booking.setCurrency(bookingRequest.getCurrency());
        booking.setSupplierId(bookingRequest.getSupplierId());
        booking.setDescription(bookingRequest.getDescription());
        return this.toBookingResponse(bookingRepository.save(booking));

    }

    private CurrencyExchangeResponse toCurrencyExchangeResponse(String sourceCurrency, BigDecimal amount) {

        CurrencyExchangeResponse currencyExchangeResponse = new CurrencyExchangeResponse();
        String targetCurrency = "USD".equals(sourceCurrency) ? "EUR" : "USD";
        BigDecimal exchangeRate = currencyConversionService.getExchangeRate(sourceCurrency, targetCurrency).blockOptional().orElseThrow(() -> new ExchangeRateNotAvailableException(sourceCurrency, targetCurrency));

        BigDecimal amountInSaleCurrency = amount.multiply(exchangeRate);

        currencyExchangeResponse.setAmountInSaleCurrency(amountInSaleCurrency);
        currencyExchangeResponse.setExchangeRate(exchangeRate);

        return currencyExchangeResponse;
    }

    @Override
    public String delete(Long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id));
        bookingRepository.delete(booking);
        return "Booking with id: " + id + "successfully deleted";
    }

    @Override
    public void payBooking(Long bookingId, boolean paid) {

        Booking booking = bookingRepository.findById(bookingId).orElseThrow(() -> new BookingNotFoundException(bookingId));
        booking.setPaid(paid);
    }

    @Override
    public List<BookingResponse> findAllByBookingNumber(String searchTerm) {

        return bookingRepository.findAllByBookingNumber(searchTerm).stream().map(this::toBookingResponse).toList();
    }

    @Override
    public BookingResponse toBookingResponse(Booking booking) {

        BookingResponse bookingResponse = new BookingResponse();
        bookingResponse.setId(booking.getId());
        bookingResponse.setSupplierId(booking.getSupplierId());
        bookingResponse.setBookingNumber(booking.getBookingNumber());
        bookingResponse.setBookingDate(booking.getBookingDate());
        bookingResponse.setReservationDate(booking.getReservationDate());
        bookingResponse.setDescription(booking.getDescription());
        bookingResponse.setAmount(booking.getAmount());
        bookingResponse.setCurrency(booking.getCurrency());
        bookingResponse.setPaid(booking.isPaid());
        bookingResponse.setAmountInSaleCurrency(booking.getAmountInSaleCurrency());
        bookingResponse.setExchangeRate(booking.getExchangeRate());

        return bookingResponse;
    }

    @Override
    public Booking toBooking(BookingRequest bookingRequest) {
        Booking booking = new Booking();
        booking.setBookingNumber(bookingRequest.getBookingNumber());
        booking.setBookingDate(LocalDate.now());
        booking.setReservationDate(bookingRequest.getReservationDate());
        booking.setDescription(bookingRequest.getDescription());
        booking.setAmount(bookingRequest.getAmount());
        booking.setCurrency(bookingRequest.getCurrency());
        booking.setSupplierId(bookingRequest.getSupplierId());
        booking.setPaid(bookingRequest.isPaid());
        booking.setExchangeRate(bookingRequest.getExchangeRate());
        booking.setAmountInSaleCurrency(bookingRequest.getAmountInSaleCurrency());
        return booking;
    }
}
