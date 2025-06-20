package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.CustomerPaymentRequest;
import com.crishof.travelagent.dto.CustomerPaymentResponse;
import com.crishof.travelagent.mapper.CustomerPaymentMapper;
import com.crishof.travelagent.service.CustomerPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customerPayment")
@RequiredArgsConstructor
public class CustomerPaymentController {

    private final CustomerPaymentService customerPaymentService;
    private final CustomerPaymentMapper customerPaymentMapper;

    @GetMapping("/getAll")
    public ResponseEntity<List<CustomerPaymentResponse>> getAll() {
        return ResponseEntity.ok(customerPaymentService.getAll()
                .stream().map(customerPaymentMapper::toDto).toList());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<CustomerPaymentResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(customerPaymentMapper.toDto(customerPaymentService.getById(id)));
    }

    @GetMapping("/customers/{customerId}/travel/{travelId}/payments")
    public ResponseEntity<List<CustomerPaymentResponse>> getAllByCustomerIdAndTravelId(@PathVariable Long customerId, @PathVariable Long travelId) {
        return ResponseEntity.ok(customerPaymentService.getAllByCustomerIdAndTravelId(customerId, travelId).stream()
                .map(customerPaymentMapper::toDto).toList());
    }

    @PostMapping("/save")
    public ResponseEntity<CustomerPaymentResponse> save(@RequestBody CustomerPaymentRequest customerPaymentRequest) {
        return ResponseEntity.ok(customerPaymentMapper.toDto(customerPaymentService.create(customerPaymentRequest)));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<CustomerPaymentResponse> update(@PathVariable Long id, @RequestBody CustomerPaymentRequest customerPaymentRequest) {
        return ResponseEntity.ok(customerPaymentMapper.toDto(customerPaymentService.update(id, customerPaymentRequest)));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.ok(customerPaymentService.delete(id));
    }

}
