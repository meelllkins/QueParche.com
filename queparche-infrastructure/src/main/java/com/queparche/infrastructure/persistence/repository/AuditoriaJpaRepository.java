package com.queparche.infrastructure.persistence.repository;

import com.queparche.infrastructure.persistence.entity.AuditoriaJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditoriaJpaRepository extends JpaRepository<AuditoriaJpaEntity, Long> {
}
