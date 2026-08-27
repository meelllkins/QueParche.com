package com.queparche.application.servicio;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Modelo de lectura (projection) para el listado público de servicios.
 *
 * Combina datos de dos agregados —Servicio y Usuario— sin acoplarlos:
 * el dominio sigue refiriéndose al emprendedor solo por su UUID, y es la
 * capa de aplicación la que resuelve el nombre coordinando ambos puertos.
 * Por eso esto es un record de aplicación y no una entidad de dominio.
 */
public record ServicioListado(
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
