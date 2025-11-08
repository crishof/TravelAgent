package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.MonthlySalesDTO;
import com.crishof.travelagent.service.TravelSaleServiceImpl;
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

    private final TravelSaleServiceImpl travelSaleServiceImpl;

    //Total Sales
    @GetMapping("/getTotalSales")
    public ResponseEntity<Double> getTotalSales() {
        return ResponseEntity.ok(travelSaleServiceImpl.getTotalSales());
    }

    //Pending Payments
    @GetMapping("/getPendingPayments")
    public ResponseEntity<Double> getPendingPayments() {
        return ResponseEntity.ok(0.0);
    }

    //Total Customers
    @GetMapping("/getTotalCustomers")
    public ResponseEntity<Integer> getTotalCustomers() {
        return ResponseEntity.ok(0);
    }

    //Sales by month
    @GetMapping("/getSalesByMonth")
    public ResponseEntity<List<MonthlySalesDTO>> getSalesByMonth() {

        List<MonthlySalesDTO> totalSales = travelSaleServiceImpl.getSalesByMonth();

        System.out.println("totalSales = " + totalSales);

        return ResponseEntity.ok(totalSales);
    }
    //Top Suppliers
    //Recent Sales
    //Recent bookings
}
