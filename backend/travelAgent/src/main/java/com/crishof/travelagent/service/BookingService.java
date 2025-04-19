package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.model.Booking;

import java.util.List;

public interface BookingService {

    List<BookingResponse> getAll();

    BookingResponse getById(long id);

    BookingResponse create(BookingRequest bookingRequest);

    Booking createEntity(BookingRequest bookingRequest);

    BookingResponse update(long id, BookingRequest bookingRequest);

    String delete(long id);

    Booking toBooking(BookingRequest bookingRequest);

    BookingResponse toBookingResponse(Booking booking);
}
