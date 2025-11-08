package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.MonthlySalesDTO;
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

    //Total Sales
    @GetMapping("/getTotalSales")
    public ResponseEntity<Double> getTotalSales() {
        return ResponseEntity.ok(travelSaleService.getTotalSales());
    }

    //Pending Payments
    @GetMapping("/getPendingPayments")
    public ResponseEntity<Double> getPendingPayments() {
        return ResponseEntity.ok(0.0);
    }

    //Total Customers
    @GetMapping("/getTotalCustomers")
    public ResponseEntity<Integer> totalCustomers() {
        return ResponseEntity.ok(customerService.getTotalCustomers());
    }

    //Sales by month
    @GetMapping("/getSalesByMonth")
    public ResponseEntity<List<MonthlySalesDTO>> getSalesByMonth() {
        List<MonthlySalesDTO> totalSales = travelSaleService.getSalesByMonth();
        return ResponseEntity.ok(totalSales);
    }

    //Top Suppliers
    //Recent Sales
    //Recent bookings
}
