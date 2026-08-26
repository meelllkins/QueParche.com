package com.queparche.infrastructure.web.dto.request;

import java.time.LocalDateTime;
import java.util.UUID;

public record CrearServicioRequest(UUID emprendedorId, String nombre, String descripcion,
                                    LocalDateTime fechaHora, double latitud, double longitud, String direccion) {
}
