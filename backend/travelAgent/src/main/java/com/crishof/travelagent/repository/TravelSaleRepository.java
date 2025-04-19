package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.TravelSale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelSaleRepository extends JpaRepository<TravelSale, Long> {

}
