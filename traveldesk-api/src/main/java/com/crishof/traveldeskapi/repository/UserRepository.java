package com.crishof.traveldeskapi.repository;

import com.crishof.traveldeskapi.model.User;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(@NotNull String email);

    boolean existsByEmailIgnoreCaseAndIdNot(String email, UUID id);

    List<User> findAllByAgencyIdOrderByFullNameAsc(UUID agencyId);

    Optional<User> findByIdAndAgencyId(UUID id, UUID agencyId);
}
