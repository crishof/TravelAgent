package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.Agency;
import com.crishof.travelagent.model.TravelSale;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TravelSaleRepository extends JpaRepository<TravelSale, Long> {

    @EntityGraph(attributePaths = {
            "customer",
            "services",
            "services.supplier",
            "agency",
            "user"
    })
    List<TravelSale> findAllByAgency(Agency agency);

    @EntityGraph(attributePaths = {"services", "customer", "agency", "user", "services.supplier"})
    Optional<TravelSale> findById(Long id);

    @EntityGraph(attributePaths = {"services", "customer", "agency", "user", "services.supplier"})
    List<TravelSale> findAllByCustomerIdAndAgencyId(Long customerId, Long agencyId);
}
