package com.queparche.application.usuario;

import com.queparche.application.shared.exception.UsuarioNoEncontradoException;
import com.queparche.application.usuario.port.in.ActualizarPerfilUseCase;
import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.port.out.UsuarioRepositoryPort;

public class ActualizarPerfilService implements ActualizarPerfilUseCase {

    private final UsuarioRepositoryPort repositorio;

    public ActualizarPerfilService(UsuarioRepositoryPort repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public Usuario actualizar(ActualizarPerfilCommand command) {
        Usuario usuario = repositorio.buscarPorId(command.usuarioId())
                .orElseThrow(() -> new UsuarioNoEncontradoException(command.usuarioId()));

        usuario.actualizarPerfil(
                command.telefono(),
                command.correoSecundario(),
                command.redesSociales()
        );

        repositorio.guardar(usuario);
        return usuario;
    }
}
