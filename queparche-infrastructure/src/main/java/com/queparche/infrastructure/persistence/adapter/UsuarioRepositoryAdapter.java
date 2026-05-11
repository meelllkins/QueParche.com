package com.queparche.infrastructure.persistence.adapter;

import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.port.out.UsuarioRepositoryPort;
import com.queparche.domain.usuario.vo.Email;
import com.queparche.infrastructure.persistence.entity.UsuarioJpaEntity;
import com.queparche.infrastructure.persistence.mapper.UsuarioMapper;
import com.queparche.infrastructure.persistence.repository.UsuarioJpaRepository;
import com.queparche.infrastructure.persistence.util.PasswordHasher;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class UsuarioRepositoryAdapter implements UsuarioRepositoryPort {

    private final UsuarioJpaRepository jpaRepository;

    public UsuarioRepositoryAdapter(UsuarioJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public void guardar(Usuario usuario) {
        Optional<UsuarioJpaEntity> existente = jpaRepository.findByUuid(usuario.getId().toString());

        UsuarioJpaEntity entity = existente.orElseGet(UsuarioJpaEntity::new);

        // Nuevo registro → hasheamos; actualización de perfil → conservamos el hash almacenado
        String passwordHash = existente.isPresent()
                ? existente.get().getPasswordHash()
                : PasswordHasher.hash(usuario.getContrasena().getValorCrudo());

        UsuarioMapper.mapear(entity, usuario, passwordHash);
        UsuarioMapper.sincronizarRedes(entity, usuario);
        jpaRepository.save(entity);
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
}
