package com.queparche.infrastructure.persistence.adapter;

import com.queparche.domain.usuario.TipoRol;
import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.port.out.UsuarioRepositoryPort;
import com.queparche.domain.usuario.vo.Email;
import com.queparche.infrastructure.persistence.entity.AuditoriaJpaEntity;
import com.queparche.infrastructure.persistence.entity.UsuarioJpaEntity;
import com.queparche.infrastructure.persistence.mapper.UsuarioMapper;
import com.queparche.infrastructure.persistence.repository.AuditoriaJpaRepository;
import com.queparche.infrastructure.persistence.repository.UsuarioJpaRepository;
import com.queparche.infrastructure.persistence.util.PasswordHasher;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Repository
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository jpaRepository;
    private final AuditoriaJpaRepository auditoriaJpaRepository;

    public UsuarioRepositoryAdapter(UsuarioJpaRepository jpaRepository,
                                     AuditoriaJpaRepository auditoriaJpaRepository) {
        this.jpaRepository = jpaRepository;
        this.auditoriaJpaRepository = auditoriaJpaRepository;
    }

    @Override
    public void guardar(Usuario usuario) {
        Optional<UsuarioJpaEntity> existente = jpaRepository.findByUuid(usuario.getId().toString());
        boolean esNuevo = existente.isEmpty();

        UsuarioJpaEntity entity = existente.orElseGet(UsuarioJpaEntity::new);

        // Nuevo registro → hasheamos; actualización de perfil → conservamos el hash almacenado
        String passwordHash = esNuevo
                ? PasswordHasher.hash(usuario.getContrasena().getValorCrudo())
                : existente.get().getPasswordHash();

        UsuarioMapper.mapear(entity, usuario, passwordHash);
        UsuarioMapper.sincronizarRedes(entity, usuario);
        jpaRepository.save(entity);

        registrarAuditoria(usuario, esNuevo);
    }

    @Override
    public Optional<Usuario> buscarPorId(UUID id) {
        return jpaRepository.findByUuid(id.toString())
                .map(UsuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(Email email) {
        return jpaRepository.findByEmail(email.getValor())
                .map(UsuarioMapper::toDomain);
    }

    @Override
    public boolean existePorEmail(Email email) {
        return jpaRepository.existsByEmail(email.getValor());
    }

    private void registrarAuditoria(Usuario usuario, boolean esNuevo) {
        String accion;
        if (esNuevo) {
            accion = usuario.getRol() == TipoRol.EMPRENDEDOR
                    ? "REGISTRO_EMPRENDEDOR"
                    : "REGISTRO_CLIENTE";
        } else {
            accion = "ACTUALIZACION_PERFIL";
        }

        AuditoriaJpaEntity auditoria = new AuditoriaJpaEntity();
        auditoria.setUsuarioUuid(usuario.getId().toString());
        auditoria.setAccion(accion);
        auditoria.setFechaRegistro(LocalDateTime.now());
        auditoria.setDetalles("Email: " + usuario.getEmail().getValor()
                + " | Rol: " + usuario.getRol().name());
        auditoriaJpaRepository.save(auditoria);
    }
}
