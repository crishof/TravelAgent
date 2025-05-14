package com.crishof.travelagent.exception;

public class PaymentNotFoundException extends RuntimeException {

    public PaymentNotFoundException(Long id) {
        super("Payment with id " + id + " not found");
    }
}
