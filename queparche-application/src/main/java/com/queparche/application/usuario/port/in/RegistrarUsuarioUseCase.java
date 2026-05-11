package com.queparche.application.usuario.port.in;

import com.queparche.application.usuario.UsuarioCommand;
import com.queparche.domain.usuario.Usuario;

/**
 * Puerto de entrada (driving port) para RF02.
 * Segregación: la capa de infraestructura llama a esta interfaz; nunca al Service directamente.
 */
public interface RegistrarUsuarioUseCase {

    Usuario registrar(UsuarioCommand command);
}
