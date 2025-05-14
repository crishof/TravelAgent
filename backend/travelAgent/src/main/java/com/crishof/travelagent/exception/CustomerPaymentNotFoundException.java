package com.crishof.travelagent.exception;


public class CustomerPaymentNotFoundException extends RuntimeException {

    public CustomerPaymentNotFoundException(Long id) {
        super("Customer payment with id " + id + " not found");
    }
}
