package com.queparche.application.usuario;

import java.util.Map;
import java.util.UUID;

/**
 * DTO de entrada para RF03/RF07.
 * Viaja con UUID — nunca con el Long interno de la base de datos.
 */
public record ActualizarPerfilCommand(
        UUID usuarioId,
        String telefono,
        String correoSecundario,
        Map<String, String> redesSociales
) {
}
