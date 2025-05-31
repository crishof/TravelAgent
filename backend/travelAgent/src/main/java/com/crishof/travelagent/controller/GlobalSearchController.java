package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.dto.CustomerResponse;
import com.crishof.travelagent.dto.SearchResultDTO;
import com.crishof.travelagent.service.BookingService;
import com.crishof.travelagent.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/globalSearch")
@RequiredArgsConstructor
public class GlobalSearchController {

    private final CustomerService customerService;
    private final BookingService bookingService;

    @GetMapping("/findByTerm")
    public ResponseEntity<SearchResultDTO> findByTerm(@RequestParam String searchTerm) {

        List<CustomerResponse> customers = customerService.globalSearch(searchTerm);
        if (!customers.isEmpty()) {
            return ResponseEntity.ok(new SearchResultDTO("Customer", customers));
        }

        List<BookingResponse> bookings = bookingService.findAllByBookingNumber(searchTerm);
        if (!bookings.isEmpty()) {
            return ResponseEntity.ok(new SearchResultDTO("Booking", bookings));
        }
        return ResponseEntity.ok(new SearchResultDTO("none", List.of()));
    }
}
