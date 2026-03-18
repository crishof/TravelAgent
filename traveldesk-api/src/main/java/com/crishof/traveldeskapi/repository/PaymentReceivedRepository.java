package com.crishof.traveldeskapi.repository;

import com.crishof.traveldeskapi.model.PaymentReceived;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PaymentReceivedRepository extends JpaRepository<PaymentReceived, UUID> {

    List<PaymentReceived> findBySaleId(UUID saleId);

}