package com.queparche.application.servicio;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO de entrada para RF10. Transporta coordenadas primitivas —
 * el dominio construye el VO Ubicacion dentro del Service.
 */
public record ServicioCommand(
        UUID emprendedorId,
        String nombre,
        String descripcion,
        LocalDateTime fechaHora,
        double latitud,
        double longitud,
        String direccion
) {
}
