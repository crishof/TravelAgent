package com.crishof.travelagent.repository;

import com.crishof.travelagent.model.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgencyRepository extends JpaRepository<Agency, Long> {
}
