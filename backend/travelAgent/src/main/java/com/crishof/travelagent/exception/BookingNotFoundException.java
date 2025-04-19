package com.crishof.travelagent.exception;

public class BookingNotFoundException extends RuntimeException {

    public BookingNotFoundException() {
        super();
    }

    public BookingNotFoundException(String message) {
        super(message);
    }

    public BookingNotFoundException(Long id) {
        super("Booking with id " + id + " not found");
    }
}
