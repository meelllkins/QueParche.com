package com.queparche.infrastructure.web.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Respuesta del listado público de servicios (GET /api/v1/servicios).
 *
 * Es un DTO aparte de ServicioResponse a propósito: añade
 * `emprendedorNombre` sin alterar el contrato que ya devuelven los
 * endpoints de escritura.
 */
public record ServicioListadoResponse(
        UUID id,
        String nombre,
        String descripcion,
        LocalDateTime fechaHora,
        double latitud,
        double longitud,
        String direccion,
        UUID emprendedorId,
        String emprendedorNombre
) {
}
