package com.queparche.infrastructure.persistence.repository;

import com.queparche.infrastructure.persistence.entity.ServicioJpaEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServicioJpaRepository extends JpaRepository<ServicioJpaEntity, Long> {

    Optional<ServicioJpaEntity> findByUuid(String uuid);

    List<ServicioJpaEntity> findByEmprendedor_Uuid(String emprendedorUuid);
}
