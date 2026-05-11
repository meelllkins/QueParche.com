package com.queparche.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "auditoria_operaciones")
@Getter @Setter @NoArgsConstructor
public class AuditoriaJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "usuario_uuid", nullable = false, length = 36)
    private String usuarioUuid;

    @Column(nullable = false, length = 100)
    private String accion;

    @Column(name = "fecha_registro")
    private LocalDateTime fechaRegistro;

    @Column(columnDefinition = "TEXT")
    private String detalles;
}
