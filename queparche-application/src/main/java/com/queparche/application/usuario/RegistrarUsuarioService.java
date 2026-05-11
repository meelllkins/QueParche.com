package com.queparche.application.usuario;

import com.queparche.application.shared.exception.EmailYaRegistradoException;
import com.queparche.application.usuario.port.in.RegistrarUsuarioUseCase;
import com.queparche.domain.usuario.TipoRol;
import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.port.out.UsuarioRepositoryPort;
import com.queparche.domain.usuario.vo.Email;

public class RegistrarUsuarioService implements RegistrarUsuarioUseCase {

    private final UsuarioRepositoryPort repositorio;

    public RegistrarUsuarioService(UsuarioRepositoryPort repositorio) {
        this.repositorio = repositorio;
    }

    @Override
    public Usuario registrar(UsuarioCommand command) {
        Email email = new Email(command.email());

        if (repositorio.existePorEmail(email)) {
            throw new EmailYaRegistradoException(email.getValor());
        }

        Usuario usuario = command.tipoRol() == TipoRol.EMPRENDEDOR
                ? Usuario.registrarEmprendedor(command.nombre(), command.email(), command.contrasena())
                : Usuario.registrarCliente(command.nombre(), command.email(), command.contrasena());

        repositorio.guardar(usuario);
        return usuario;
    }
}
