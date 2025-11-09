package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.dto.CurrencyExchangeResponse;
import com.crishof.travelagent.dto.TopSupplierDTO;
import com.crishof.travelagent.model.Booking;

import java.math.BigDecimal;
import java.util.List;

public interface BookingService {

    List<Booking> getAll();

    Booking getById(Long id);

    Booking createEntity(BookingRequest bookingRequest, String saleCurrency);

    Booking createAndSave(BookingRequest bookingRequest, String saleCurrency);

    Booking update(Long id, BookingRequest bookingRequest);

    String delete(Long id);

    void payBooking(Long id, boolean paid);

    List<Booking> findAllByBookingNumber(String bookingNumber);

    CurrencyExchangeResponse getCurrencyConversion(String fromCurrency, String toCurrency, BigDecimal amount);

    List<TopSupplierDTO> getTopSuppliers();

    List<BookingResponse> getNonPaidBookings();
}
