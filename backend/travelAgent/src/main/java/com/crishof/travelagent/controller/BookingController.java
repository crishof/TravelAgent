package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.BookingRequest;
import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.service.BookingService;
import com.crishof.travelagent.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/booking")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final PaymentService paymentService;

    @GetMapping("/getAll")
    public ResponseEntity<List<BookingResponse>> getAll() {
        return ResponseEntity.ok(bookingService.getAll());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<BookingResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(bookingService.getById(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<BookingResponse> update(@PathVariable("id") long id, @RequestBody BookingRequest bookingRequest) {
        return ResponseEntity.ok(bookingService.update(id, bookingRequest));
    }

    @PostMapping("/save")
    public ResponseEntity<BookingResponse> save(@RequestBody BookingRequest bookingRequest) {

        BookingResponse bookingResponse = bookingService.create(bookingRequest, bookingRequest.getSaleCurrency());

        if (bookingRequest.isPaid()) {
            paymentService.createFromBooking(bookingRequest.getId(), bookingRequest.getAmount(), bookingRequest.getCurrency());
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(bookingResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(bookingService.delete(id));
    }

}
