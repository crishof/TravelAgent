package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.Agency;
import com.crishof.travelagent.model.TravelSale;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
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

    @Query(value = """
            SELECT TO_CHAR(s.creation_date, 'YYYY-MM') AS month,
                   SUM(s.amount) AS total
            FROM tbl_travel_sale s
            WHERE s.creation_date >= CURRENT_DATE - INTERVAL '12 MONTH'
            GROUP BY TO_CHAR(s.creation_date, 'YYYY-MM')
            ORDER BY TO_CHAR(s.creation_date, 'YYYY-MM')
            """,
            nativeQuery = true)
    List<Object[]> findSalesByMonthNative();


    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM TravelSale s where s.currency LIKE 'EURO'")
    Double getTotalSalesEuro();

    @Query("SELECT COALESCE(SUM(s.amount), 0) FROM TravelSale s where s.currency LIKE 'USD'")
    Double getTotalSalesUsd();
}
