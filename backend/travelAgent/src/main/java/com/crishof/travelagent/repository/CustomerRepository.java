package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByDniOrPassport(String dni, String passport);

    //TODO Corregir QUERY unaccent
    @Query(value = "SELECT * FROM tbl_customer c WHERE " +
            "(lower(c.name)) LIKE (lower(concat('%', :term, '%'))) OR " +
            "(lower(c.lastname)) LIKE (lower(concat('%', :term, '%'))) OR " +
            "lower(c.dni) = lower(:term) OR " +
            "lower(c.passport) = lower(:term)",
            nativeQuery = true)
    List<Customer> globalSearch(@Param("term") String term);
}
