package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.Agency;
import com.crishof.travelagent.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    List<Supplier> findAllByAgency(Agency agency);
}
