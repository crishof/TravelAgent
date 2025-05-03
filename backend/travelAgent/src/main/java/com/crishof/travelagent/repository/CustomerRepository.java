package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Customer findByDniOrPassport(String dni, String passport);
}
