package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.PaymentRequest;
import com.crishof.travelagent.dto.PaymentResponse;
import com.crishof.travelagent.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping("/getAll")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAll());
    }

    @PostMapping("/save")
    public ResponseEntity<PaymentResponse> savePayment(@RequestBody PaymentRequest paymentRequest) {
        return ResponseEntity.ok(paymentService.create(paymentRequest));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(@PathVariable("id") Long id, @RequestBody PaymentRequest paymentRequest) {
        return ResponseEntity.ok(paymentService.update(id, paymentRequest));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePayment(@PathVariable("id") Long id) {
        return ResponseEntity.ok(paymentService.delete(id));
    }


}
