package com.crishof.traveldeskapi.controller;

import com.crishof.traveldeskapi.dto.MessageResponse;
import com.crishof.traveldeskapi.dto.BookingRequest;
import com.crishof.traveldeskapi.dto.BookingResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
@Slf4j
public class BookingController {

    //  ===============
    //  GET BOOKINGS
    //  ===============

    @Operation(summary = "Get bookings")
    @ApiResponse(responseCode = "200", description = "Bookings retrieved successfully")
    @GetMapping
    public ResponseEntity<java.util.List<BookingResponse>> getBookings() {
        log.info("Get bookings request received");
        return ResponseEntity.ok(java.util.List.of());
    }

    //  ===============
    //  CREATE BOOKING
    //  ===============

    @Operation(summary = "Create a new booking")
    @ApiResponse(responseCode = "201", description = "Booking created successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        log.info("Create booking request received for reference={}", request.reference());
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  UPDATE BOOKING
    //  ===============

    @Operation(summary = "Update a booking")
    @ApiResponse(responseCode = "200", description = "Booking updated successfully")
    @ApiResponse(responseCode = "400", description = "Invalid request")
    @PutMapping("/{id}")
    public ResponseEntity<BookingResponse> updateBooking(@PathVariable Long id, @Valid @RequestBody BookingRequest request) {
        log.info("Update booking request received for id={}", id);
        return ResponseEntity.ok().build();
    }

    //  ===============
    //  DELETE BOOKING
    //  ===============

    @Operation(summary = "Delete a booking")
    @ApiResponse(responseCode = "200", description = "Booking deleted successfully")
    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteBooking(@PathVariable Long id) {
        log.info("Delete booking request received for id={}", id);
        return ResponseEntity.ok().build();
    }
}