package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AgencyRepository extends JpaRepository<Agency, Long> {


    Optional<Agency> findByName(String name);
}
