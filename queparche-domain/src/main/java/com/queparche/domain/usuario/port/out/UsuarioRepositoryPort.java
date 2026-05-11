package com.queparche.domain.usuario.port.out;

import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.vo.Email;

import java.util.Optional;
import java.util.UUID;

/**
 * Puerto de salida (driven port): contrato que el dominio exige a la persistencia.
 * La implementación vive en queparche-infrastructure. El dominio no sabe que existe JPA.
 */
public interface UsuarioRepositoryPort {

    void guardar(Usuario usuario);

    Optional<Usuario> buscarPorId(UUID id);

    Optional<Usuario> buscarPorEmail(Email email);

    boolean existePorEmail(Email email);
}
