package com.queparche.infrastructure.persistence.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuario_redes")
@Getter @Setter @NoArgsConstructor
public class UsuarioRedJpaEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UsuarioJpaEntity usuario;

    @Column(length = 50, nullable = false)
    private String plataforma;

    @Column(name = "url_perfil", length = 255, nullable = false)
    private String urlPerfil;
}
