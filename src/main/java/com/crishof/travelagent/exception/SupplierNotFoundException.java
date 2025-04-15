package com.crishof.travelagent.exception;

public class SupplierNotFoundException extends RuntimeException {

    public SupplierNotFoundException() {
        super();
    }

    public SupplierNotFoundException(String message) {
        super(message);
    }

    public SupplierNotFoundException(Long id) {
        super("Supplier with id " + id + " not found");
    }
}
