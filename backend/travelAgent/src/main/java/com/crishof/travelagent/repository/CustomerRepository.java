package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    //TODO Corregir QUERY unaccent
    @Query(value = "SELECT * FROM tbl_customer c WHERE " +
            "(lower(c.first_name)) LIKE (lower(concat('%', :term, '%'))) OR " +
            "(lower(c.last_name)) LIKE (lower(concat('%', :term, '%'))) OR " +
            "lower(c.dni) = lower(:term) OR " +
            "lower(c.passport) = lower(:term)",
            nativeQuery = true)
    List<Customer> globalSearch(@Param("term") String term);

    Optional<Customer> findByDniOrPassportOrEmail(String dni, String passport, String email);

    Optional<Customer> findByDni(String dni);

    Optional<Customer> findByPassport(String passport);

    Optional<Customer> findByEmail(String email);
}



