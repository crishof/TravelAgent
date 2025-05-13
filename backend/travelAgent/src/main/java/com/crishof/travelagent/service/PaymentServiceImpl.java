package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.PaymentRequest;
import com.crishof.travelagent.dto.PaymentResponse;
import com.crishof.travelagent.exception.PaymentNotFoundException;
import com.crishof.travelagent.model.Payment;
import com.crishof.travelagent.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingService bookingService;

    @Override
    public List<PaymentResponse> getAll() {
        return paymentRepository.findAll().stream()
                .map(this::toPaymentResponse).sorted(Comparator.comparing(PaymentResponse::getPaymentDate)).toList();
    }

    @Override
    public PaymentResponse getById(Long id) {
        return this.toPaymentResponse(paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(id)));
    }

    @Override
    public PaymentResponse create(PaymentRequest paymentRequest) {
        bookingService.payBooking(paymentRequest.getBookingId(), true);
        return this.toPaymentResponse(paymentRepository.save(toPayment(paymentRequest)));
    }

    @Override
    public PaymentResponse update(Long id, PaymentRequest paymentRequest) {

        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(id));
        payment.setPaymentDate(paymentRequest.getPaymentDate());
        payment.setAmount(paymentRequest.getAmount());
        payment.setCurrency(paymentRequest.getCurrency());
        payment.setBookingId(paymentRequest.getBookingId());
        payment.setCustomerId(paymentRequest.getCustomerId());
        return this.toPaymentResponse(paymentRepository.save(payment));

    }

    @Override
    public String delete(Long id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(id));
        bookingService.payBooking(payment.getBookingId(), false);
        paymentRepository.delete(payment);
        return "Payment deleted successfully";
    }


    public PaymentResponse toPaymentResponse(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentDate(payment.getPaymentDate())
                .bookingId(payment.getBookingId())
                .customerId(payment.getCustomerId())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .build();
    }

    public Payment toPayment(PaymentRequest paymentRequest) {
        return Payment.builder()
                .paymentDate(LocalDate.now())
                .bookingId(paymentRequest.getBookingId())
                .customerId(paymentRequest.getCustomerId())
                .amount(paymentRequest.getAmount())
                .currency(paymentRequest.getCurrency())
                .build();
    }
}
