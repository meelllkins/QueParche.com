package com.queparche.domain.servicio.port.out;

import com.queparche.domain.servicio.Servicio;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Puerto de salida: contrato que el dominio exige a la persistencia de Servicio.
 * La implementación JPA vive en queparche-infrastructure.
 */
public interface ServicioRepositoryPort {

    void guardar(Servicio servicio);

    Optional<Servicio> buscarPorId(UUID id);

    List<Servicio> buscarPorEmprendedorId(UUID emprendedorId);

    /** Todos los servicios publicados. Alimenta el listado público (RF10 — lectura). */
    List<Servicio> buscarTodos();
}
