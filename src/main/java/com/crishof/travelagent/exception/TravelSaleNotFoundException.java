package com.crishof.travelagent.exception;

public class TravelSaleNotFoundException extends RuntimeException {

    public TravelSaleNotFoundException() {
        super();
    }

    public TravelSaleNotFoundException(String message) {
        super(message);
    }

    public TravelSaleNotFoundException(Long id) {
        super("Travel Sale with id " + id + " not found");
    }
}
