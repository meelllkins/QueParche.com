package com.queparche.infrastructure.web.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

public record ServicioResponse(UUID id, String nombre, String descripcion, LocalDateTime fechaHora,
                                double latitud, double longitud, String direccion, UUID emprendedorId) {
}
