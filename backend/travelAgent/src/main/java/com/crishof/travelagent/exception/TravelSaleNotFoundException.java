package com.crishof.travelagent.exception;

import java.io.Serial;

public class TravelSaleNotFoundException extends RuntimeException {

    // Ensures serialization compatibility between different versions of this class.
    // Prevents deserialization errors if the class structure changes in the future.
    @Serial
    private static final long serialVersionUID = 1L;

    // 🔹 Default Constructor
    public TravelSaleNotFoundException() {
        super("Travel sale not found");
    }

    // 🔹 Custom message constructor
    public TravelSaleNotFoundException(String message) {
        super(message);
    }

    // 🔹 Constructor with ID (Standard message)
    public TravelSaleNotFoundException(Long id) {
        super("Travel sale with id " + id + " not found");
    }

    // 🔹 Constructor with message and cause (to chain exceptions)
    public TravelSaleNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    // 🔹 Constructor with cause (without an explicit message)
    public TravelSaleNotFoundException(Throwable cause) {
        super(cause);
    }
}