package com.queparche.application.shared.exception;

import java.util.UUID;

public class UsuarioNoEncontradoException extends RuntimeException {

    public UsuarioNoEncontradoException(UUID id) {
        super("No se encontró ningún usuario con ID: " + id);
    }
}
