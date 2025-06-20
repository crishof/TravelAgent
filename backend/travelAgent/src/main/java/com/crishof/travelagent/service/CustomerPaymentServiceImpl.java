package com.crishof.travelagent.service;

import com.crishof.travelagent.dto.CustomerPaymentRequest;
import com.crishof.travelagent.exception.CustomerPaymentNotFoundException;
import com.crishof.travelagent.exception.ExchangeRateNotAvailableException;
import com.crishof.travelagent.exception.TravelSaleNotFoundException;
import com.crishof.travelagent.model.Customer;
import com.crishof.travelagent.model.CustomerPayment;
import com.crishof.travelagent.model.TravelSale;
import com.crishof.travelagent.repository.CustomerPaymentRepository;
import com.crishof.travelagent.repository.TravelSaleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerPaymentServiceImpl implements CustomerPaymentService {

    private final CustomerPaymentRepository customerPaymentRepository;
    private final CurrencyConversionService currencyConversionService;
    private final CustomerService customerService;
    private final UserService userService;
    private final TravelSaleRepository travelSaleRepository;


    @Override
    public List<CustomerPayment> getAll() {
        return customerPaymentRepository.findAll().stream().sorted(Comparator.comparing(CustomerPayment::getPaymentDate)).toList();
    }

    @Override
    public CustomerPayment getById(Long id) {
        return customerPaymentRepository.findById(id).orElseThrow(() -> new CustomerPaymentNotFoundException(id));
    }

    @Override
    @Transactional
    public CustomerPayment create(CustomerPaymentRequest paymentRequest) {

        Customer customer = customerService.getById(paymentRequest.getCustomerId());
        TravelSale sale = travelSaleRepository.findById(paymentRequest.getTravelId())
                .orElseThrow(() -> new TravelSaleNotFoundException(paymentRequest.getTravelId()));

        CustomerPayment payment = CustomerPayment.builder()
                .paymentDate(LocalDate.now())
                .customer(customer)
                .travelSale(sale)
                .amount(paymentRequest.getAmount())
                .paymentMethod(paymentRequest.getPaymentMethod())
                .currency(paymentRequest.getCurrency())
                .agency(userService.getCurrentUser().getAgency())
                .build();

        if (paymentRequest.getCurrency().equals(paymentRequest.getSaleCurrency())) {
            payment.setExchangeRate(BigDecimal.ONE);
            payment.setAmountInSaleCurrency(paymentRequest.getAmount());
        } else {
            String sourceCurrency = paymentRequest.getCurrency();
            String targetCurrency = paymentRequest.getSaleCurrency();

            BigDecimal exchangeRate = currencyConversionService
                    .getExchangeRate(sourceCurrency, targetCurrency)
                    .blockOptional()
                    .orElseThrow(() -> new ExchangeRateNotAvailableException(sourceCurrency, targetCurrency));

            BigDecimal amountInSaleCurrency = paymentRequest.getAmount().multiply(exchangeRate);
            payment.setExchangeRate(exchangeRate);
            payment.setAmountInSaleCurrency(amountInSaleCurrency);
        }

        return customerPaymentRepository.save(payment);
    }

    @Override
    public CustomerPayment update(Long id, CustomerPaymentRequest paymentRequest) {

        CustomerPayment payment = customerPaymentRepository.findById(id).orElseThrow(() -> new CustomerPaymentNotFoundException(id));
        payment.setPaymentDate(LocalDate.now());
        payment.setAmount(paymentRequest.getAmount());
        payment.setCurrency(paymentRequest.getCurrency());
        payment.setPaymentMethod(paymentRequest.getPaymentMethod());
        return customerPaymentRepository.save(payment);
    }

    @Override
    public String delete(Long id) {
        customerPaymentRepository.deleteById(id);
        return "Customer payment deleted successfully";
    }

    @Override
    public List<CustomerPayment> getAllByCustomerIdAndTravelId(Long customerId, Long travelId) {
        return customerPaymentRepository.findAllByCustomerIdAndTravelSaleId(customerId, travelId).stream()
                .sorted(Comparator.comparing(CustomerPayment::getPaymentDate))
                .toList();
    }

    @Override
    public List<CustomerPayment> getAllByTravelId(Long travelId) {
        return customerPaymentRepository.findAllByTravelSaleId(travelId);
    }
}
