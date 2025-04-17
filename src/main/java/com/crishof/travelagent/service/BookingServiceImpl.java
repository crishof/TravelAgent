package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.exception.BookingNotFoundException;
import com.crishof.travelagent.model.Booking;
import com.crishof.travelagent.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;

    @Override
    public List<BookingResponse> getAll() {

        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(this::toBookingResponse).toList();
    }

    @Override
    public BookingResponse getById(long id) {

        return toBookingResponse(bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id)));
    }

    @Override
    public BookingResponse create(BookingRequest bookingRequest) {

        return this.toBookingResponse(bookingRepository.save(this.toBooking(bookingRequest)));
    }

    @Override
    public Booking createEntity(BookingRequest bookingRequest) {

        return bookingRepository.save(this.toBooking(bookingRequest));
    }

    @Override
    public BookingResponse update(long id, BookingRequest bookingRequest) {

        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id));

        booking.setBookingNumber(bookingRequest.getBookingNumber());
        booking.setAmount(bookingRequest.getAmount());
        booking.setCurrency(bookingRequest.getCurrency());
        booking.setSupplierId(bookingRequest.getSupplierId());
        booking.setDescription(bookingRequest.getDescription());
        return this.toBookingResponse(bookingRepository.save(booking));

    }

    @Override
    public String delete(long id) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new BookingNotFoundException(id));
        bookingRepository.delete(booking);
        return "Booking with id: " + id + "successfully deleted";
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
        return booking;
    }
}
