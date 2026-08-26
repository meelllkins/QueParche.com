package com.queparche.infrastructure.persistence.mapper;

import com.queparche.domain.servicio.Servicio;
import com.queparche.domain.servicio.vo.Ubicacion;
import com.queparche.infrastructure.persistence.entity.ServicioJpaEntity;
import com.queparche.infrastructure.persistence.entity.UsuarioJpaEntity;

import java.time.LocalDateTime;
import java.util.UUID;

public final class ServicioMapper {

    private ServicioMapper() {}

    public static void mapear(ServicioJpaEntity entity, Servicio servicio, UsuarioJpaEntity emprendedor) {
        entity.setUuid(servicio.getId().toString());
        entity.setEmprendedor(emprendedor);
        entity.setNombre(servicio.getNombre());
        entity.setDescripcion(servicio.getDescripcion());
        entity.setFechaHora(servicio.getFechaHora());
        entity.setLatitud(servicio.getUbicacion().getLatitud());
        entity.setLongitud(servicio.getUbicacion().getLongitud());
        entity.setDireccion(servicio.getUbicacion().getDireccion());
        if (entity.getCreatedAt() == null) {
            entity.setCreatedAt(LocalDateTime.now());
        }
    }

    public static Servicio toDomain(ServicioJpaEntity entity) {
        return Servicio.reconstituir(
                UUID.fromString(entity.getUuid()),
                entity.getNombre(),
                entity.getDescripcion(),
                entity.getFechaHora(),
                new Ubicacion(entity.getLatitud(), entity.getLongitud(), entity.getDireccion()),
                UUID.fromString(entity.getEmprendedor().getUuid())
        );
    }

}
