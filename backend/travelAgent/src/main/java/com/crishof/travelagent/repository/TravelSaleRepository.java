package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.TravelSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelSaleRepository extends JpaRepository<TravelSale, Long> {

    List<TravelSale> findAllByCustomerId(Long customerId);
}
