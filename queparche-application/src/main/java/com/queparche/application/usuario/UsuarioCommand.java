package com.queparche.application.usuario;

import com.queparche.domain.usuario.TipoRol;

/**
 * DTO de entrada para el caso de uso RF02.
 * Record inmutable: Java garantiza que los campos no cambian tras la construcción.
 */
public record UsuarioCommand(String nombre, String email, String contrasena, TipoRol tipoRol) {
}
