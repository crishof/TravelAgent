package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.dto.MonthlySalesDTO;
import com.crishof.travelagent.dto.TopSupplierDTO;
import com.crishof.travelagent.service.BookingService;
import com.crishof.travelagent.service.CustomerService;
import com.crishof.travelagent.service.TravelSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final TravelSaleService travelSaleService;
    private final CustomerService customerService;
    private final BookingService bookingService;

    @GetMapping("/getTotalSales")
    public ResponseEntity<Double> getTotalSales() {
        return ResponseEntity.ok(travelSaleService.getTotalSales());
    }

    @GetMapping("/getTotalCustomers")
    public ResponseEntity<Integer> totalCustomers() {
        return ResponseEntity.ok(customerService.getTotalCustomers());
    }

    @GetMapping("/getSalesByMonth")
    public ResponseEntity<List<MonthlySalesDTO>> getSalesByMonth() {
        return ResponseEntity.ok(travelSaleService.getSalesByMonth());
    }

    @GetMapping("/getTopSuppliers")
    public ResponseEntity<List<TopSupplierDTO>> getTopSuppliers() {
        return ResponseEntity.ok(bookingService.getTopSuppliers());
    }

    @GetMapping("/getPendingPayments")
    public ResponseEntity<Double> getTotalPendingPayments() {
        return ResponseEntity.ok(travelSaleService.getTotalPendingPayments());
    }

    @GetMapping("/getNonPaidBookings")
    public ResponseEntity<List<BookingResponse>> getNonPaidBookings() {
        return ResponseEntity.ok(bookingService.getNonPaidBookings());
    }
}
