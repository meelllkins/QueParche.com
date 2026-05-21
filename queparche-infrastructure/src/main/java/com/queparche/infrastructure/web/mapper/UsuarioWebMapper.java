package com.queparche.infrastructure.web.mapper;

import com.queparche.domain.usuario.Usuario;
import com.queparche.infrastructure.web.dto.response.UsuarioResponse;

// R04: transformación dominio → DTO HTTP exclusivamente aquí
public final class UsuarioWebMapper {

    private UsuarioWebMapper() {}

    public static UsuarioResponse toResponse(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getEmail().getValor(),
                usuario.getRol().name()
        );
    }
}
