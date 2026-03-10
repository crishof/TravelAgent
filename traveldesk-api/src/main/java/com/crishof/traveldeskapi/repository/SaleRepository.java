package com.crishof.traveldeskapi.repository;

import com.crishof.traveldeskapi.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SaleRepository extends JpaRepository<Sale, UUID> {

    List<Sale> findAllByAgencyIdOrderBySaleDateDesc(UUID agencyId);

    Optional<Sale> findByIdAndAgencyId(UUID id, UUID agencyId);

    boolean existsByCustomerId(UUID customerId);

    boolean existsBySupplierId(UUID supplierId);

    long countByAgencyId(UUID agencyId);
}
