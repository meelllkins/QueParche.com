package com.queparche.infrastructure.persistence.mapper;

import com.queparche.domain.usuario.TipoRol;
import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.vo.Contrasena;
import com.queparche.domain.usuario.vo.Email;
import com.queparche.infrastructure.persistence.entity.UsuarioJpaEntity;
import com.queparche.infrastructure.persistence.entity.UsuarioRedJpaEntity;
import com.queparche.infrastructure.web.dto.response.UsuarioResponse;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public final class UsuarioMapper {

    private UsuarioMapper() {}

    public static void mapear(UsuarioJpaEntity entity, Usuario usuario, String passwordHash) {
        entity.setUuid(usuario.getId().toString());
        entity.setNombre(usuario.getNombre());
        entity.setEmail(usuario.getEmail().getValor());
        entity.setPasswordHash(passwordHash);
        entity.setRol(usuario.getRol().name());
        entity.setTelefono(usuario.getTelefono());
        entity.setCorreoSecundario(usuario.getCorreoSecundario());
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
    }

    public static void sincronizarRedes(UsuarioJpaEntity entity, Usuario usuario) {
        entity.getRedesSociales().clear();
        usuario.getRedesSociales().forEach((plataforma, url) -> {
            UsuarioRedJpaEntity red = new UsuarioRedJpaEntity();
            red.setPlataforma(plataforma);
            red.setUrlPerfil(url);
            red.setUsuario(entity);
            entity.getRedesSociales().add(red);
        });
    }

    public static Usuario toDomain(UsuarioJpaEntity entity) {
        Map<String, String> redes = new HashMap<>();
        entity.getRedesSociales().forEach(r -> redes.put(r.getPlataforma(), r.getUrlPerfil()));

        return Usuario.reconstituir(
                UUID.fromString(entity.getUuid()),
                new Email(entity.getEmail()),
                new Contrasena(entity.getPasswordHash()),   // hash cumple 8+ chars
                entity.getNombre(),
                TipoRol.valueOf(entity.getRol()),
                entity.getTelefono(),
                entity.getCorreoSecundario(),
                redes
        );
    }

    public static UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail().getValor(),
                usuario.getRol().name()
        );
    }
}
