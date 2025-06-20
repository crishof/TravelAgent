package com.crishof.travelagent.controller;

import com.crishof.travelagent.dto.PaymentRequest;
import com.crishof.travelagent.dto.PaymentResponse;
import com.crishof.travelagent.mapper.PaymentMapper;
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
    private final PaymentMapper paymentMapper;

    @GetMapping("/getAll")
    public ResponseEntity<List<PaymentResponse>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAll()
                .stream().map(paymentMapper::toDto).toList());
    }

    @PostMapping("/save")
    public ResponseEntity<PaymentResponse> savePayment(@RequestBody PaymentRequest paymentRequest) {
        return ResponseEntity.ok(paymentMapper.toDto(paymentService.create(paymentRequest)));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<PaymentResponse> updatePayment(@PathVariable("id") Long id, @RequestBody PaymentRequest paymentRequest) {
        return ResponseEntity.ok(paymentMapper.toDto(paymentService.update(id, paymentRequest)));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deletePayment(@PathVariable("id") Long id) {
        return ResponseEntity.ok(paymentService.delete(id));
    }


}
