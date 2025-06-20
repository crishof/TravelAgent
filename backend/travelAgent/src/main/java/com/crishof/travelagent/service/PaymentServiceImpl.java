package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.PaymentRequest;
import com.crishof.travelagent.exception.PaymentNotFoundException;
import com.crishof.travelagent.mapper.PaymentMapper;
import com.crishof.travelagent.model.Booking;
import com.crishof.travelagent.model.Payment;
import com.crishof.travelagent.model.User;
import com.crishof.travelagent.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingService bookingService;
    private final UserService userService;
    private final PaymentMapper paymentMapper;

    @Override
    public List<Payment> getAll() {

        return paymentRepository.findAll().stream()
                .sorted(Comparator.comparing(Payment::getPaymentDate))
                .toList();
    }

    @Override
    public Payment getById(Long id) {
        return paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(id));
    }

    @Override
    public Payment create(PaymentRequest paymentRequest) {
        User currentUser = userService.getCurrentUser();
        Booking booking = bookingService.getById(paymentRequest.getBookingId());

        Payment payment = paymentMapper.toEntity(paymentRequest);
        payment.setPaymentDate(LocalDate.now());
        payment.setBooking(booking);
        payment.setAgency(currentUser.getAgency());

        Payment savedPayment = paymentRepository.save(payment);

        bookingService.payBooking(booking.getId(), true);

        return savedPayment;
    }

    @Override
    public void createFromBooking(Long id, BigDecimal amount, String currency) {

        paymentRepository.save(Payment.builder()
                .paymentDate(LocalDate.now())
                .booking(bookingService.getById(id))
                .agency(userService.getCurrentUser().getAgency())
                .amount(amount)
                .currency(currency)
                .description("Created by booking service")
                .build());
    }

    @Override
    public Payment update(Long id, PaymentRequest paymentRequest) {

        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(id));

        paymentMapper.updateEntityFromRequest(paymentRequest, payment);

        return paymentRepository.save(payment);

    }

    @Override
    public String delete(Long id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new PaymentNotFoundException(id));
        bookingService.payBooking(payment.getBooking().getId(), false);
        paymentRepository.delete(payment);
        return "Payment deleted successfully";
    }
}
