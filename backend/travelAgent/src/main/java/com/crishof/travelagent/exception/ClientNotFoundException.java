package com.crishof.travelagent.exception;

public class ClientNotFoundException extends RuntimeException {

    public ClientNotFoundException() {
        super();
    }

    public ClientNotFoundException(String message) {
        super(message);
    }

    public ClientNotFoundException(Long id) {
        super("Customer with id " + id + " not found");
    }
}