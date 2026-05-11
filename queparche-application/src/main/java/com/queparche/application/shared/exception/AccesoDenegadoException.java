package com.queparche.application.shared.exception;

import java.util.UUID;

public class AccesoDenegadoException extends RuntimeException {

    public AccesoDenegadoException(UUID usuarioId) {
        super("Acceso denegado para el usuario [" + usuarioId + "]. Se requiere rol EMPRENDEDOR.");
    }
}
