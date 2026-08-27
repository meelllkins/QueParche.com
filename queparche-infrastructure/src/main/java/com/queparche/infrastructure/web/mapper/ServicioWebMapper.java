package com.queparche.infrastructure.web.mapper;

import com.queparche.application.servicio.ServicioListado;
import com.queparche.domain.servicio.Servicio;
import com.queparche.infrastructure.web.dto.response.ServicioListadoResponse;
import com.queparche.infrastructure.web.dto.response.ServicioResponse;

// R04: transformación dominio → DTO HTTP exclusivamente aquí
public final class ServicioWebMapper {

    private ServicioWebMapper() {}

    public static ServicioResponse toResponse(Servicio servicio) {
        return new ServicioResponse(
                servicio.getId(),
                servicio.getNombre(),
                servicio.getDescripcion(),
                servicio.getFechaHora(),
                servicio.getUbicacion().getLatitud(),
                servicio.getUbicacion().getLongitud(),
                servicio.getUbicacion().getDireccion(),
                servicio.getEmprendedorId()
        );
    }

    /** Projection de lectura (application) → DTO HTTP del listado. */
    public static ServicioListadoResponse toListadoResponse(ServicioListado listado) {
        return new ServicioListadoResponse(
                listado.id(),
                listado.nombre(),
                listado.descripcion(),
                listado.fechaHora(),
                listado.latitud(),
                listado.longitud(),
                listado.direccion(),
                listado.emprendedorId(),
                listado.emprendedorNombre()
        );
    }
}
