package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.CustomerPayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerPaymentRepository extends JpaRepository<CustomerPayment, Long> {

    List<CustomerPayment> findAllByCustomerIdAndTravelSaleId(Long customerId, Long travelId);

    List<CustomerPayment> findAllByTravelSaleId(Long travelId);
}
