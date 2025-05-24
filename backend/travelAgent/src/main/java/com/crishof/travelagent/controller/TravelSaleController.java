package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.BookingResponse;
import com.crishof.travelagent.dto.TravelSaleRequest;
import com.crishof.travelagent.dto.TravelSaleResponse;
import com.crishof.travelagent.service.PaymentService;
import com.crishof.travelagent.service.TravelSaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/travelSale")
@RequiredArgsConstructor
public class TravelSaleController {

    private final TravelSaleService travelSaleService;
    private final PaymentService paymentService;

    @GetMapping("/getAll")
    public ResponseEntity<List<TravelSaleResponse>> getAll() {
        return ResponseEntity.ok(travelSaleService.getAll());
    }

    @GetMapping("getById/{id}")
    public ResponseEntity<TravelSaleResponse> getById(@PathVariable("id") long id) {
        return ResponseEntity.ok(travelSaleService.getById(id));
    }

    @GetMapping("/getAllByCustomerId/{id}")
    public ResponseEntity<List<TravelSaleResponse>> getCustomerSales(@PathVariable("id") long id) {
        return ResponseEntity.ok(travelSaleService.getAllByCustomerId(id));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<TravelSaleResponse> update(@PathVariable("id") long id, @RequestBody TravelSaleRequest travelSaleRequest) {
        return ResponseEntity.ok(travelSaleService.update(id, travelSaleRequest));
    }

    @PostMapping("/save")
    public ResponseEntity<TravelSaleResponse> save(@RequestBody TravelSaleRequest travelSaleRequest) {

        TravelSaleResponse travelSaleResponse = travelSaleService.create(travelSaleRequest);

        travelSaleResponse.getServices().stream()
                .filter(BookingResponse::isPaid)
                .forEach(service ->
                        paymentService.createFromBooking(
                                service.getId(),
                                service.getAmount(),
                                service.getCurrency()));

        return ResponseEntity.status(HttpStatus.CREATED).body(travelSaleResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(travelSaleService.delete(id));
    }

    @GetMapping("/getTravelFee/{id}")
    public ResponseEntity<BigDecimal> getFee(@PathVariable long id) {
        return ResponseEntity.ok(travelSaleService.getTravelFee(id));
    }
}
