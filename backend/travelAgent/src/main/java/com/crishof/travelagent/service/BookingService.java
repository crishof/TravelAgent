package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.model.Booking;

import java.util.List;

public interface BookingService {

    List<BookingResponse> getAll();

    BookingResponse getById(Long id);

    BookingResponse create(BookingRequest bookingRequest, String saleCurrency);

    Booking createEntity(BookingRequest bookingRequest, String saleCurrency);

    BookingResponse update(Long id, BookingRequest bookingRequest);

    String delete(Long id);

    Booking toBooking(BookingRequest bookingRequest);

    BookingResponse toBookingResponse(Booking booking);

    void payBooking(Long id, boolean paid);

    List<BookingResponse> findAllByBookingNumber(String bookingNumber);
}
