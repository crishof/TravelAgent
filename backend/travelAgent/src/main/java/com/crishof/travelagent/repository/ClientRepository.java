package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Customer, Long> {
}
