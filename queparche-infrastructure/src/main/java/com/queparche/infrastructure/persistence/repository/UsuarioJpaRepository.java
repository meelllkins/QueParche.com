package com.queparche.infrastructure.persistence.repository;

import com.queparche.infrastructure.persistence.entity.UsuarioJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioJpaRepository extends JpaRepository<UsuarioJpaEntity, Long> {

    Optional<UsuarioJpaEntity> findByUuid(String uuid);

    Optional<UsuarioJpaEntity> findByEmail(String email);

    boolean existsByEmail(String email);
}
