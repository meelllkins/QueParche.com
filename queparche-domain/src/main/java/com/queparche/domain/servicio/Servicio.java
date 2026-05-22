package com.queparche.domain.servicio;

import com.queparche.domain.servicio.exception.FechaServicioInvalidaException;
import com.queparche.domain.servicio.vo.Ubicacion;
import com.queparche.domain.shared.exception.DomainValidationException;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Aggregate Root del contexto de Servicio (RF10).
 * Invariante: fechaHora siempre futura, campos obligatorios no nulos,
 * y el emprendedorId referencia a un Usuario con rol EMPRENDEDOR (validado en application).
 */
public class Servicio {

    private final UUID id;
    private String nombre;
    private String descripcion;
    private LocalDateTime fechaHora;
    private Ubicacion ubicacion;
    private final UUID emprendedorId;

    private Servicio(UUID id, String nombre, String descripcion,
                     LocalDateTime fechaHora, Ubicacion ubicacion, UUID emprendedorId) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaHora = fechaHora;
        this.ubicacion = ubicacion;
        this.emprendedorId = emprendedorId;
    }

    public static Servicio crear(String nombre, String descripcion,
                                  LocalDateTime fechaHora, Ubicacion ubicacion, UUID emprendedorId) {
        if (nombre == null || nombre.isBlank()) {
            throw new DomainValidationException("nombre", "no puede ser nulo ni vacío");
        }
        if (descripcion == null || descripcion.isBlank()) {
            throw new DomainValidationException("descripcion", "no puede ser nula ni vacía");
        }
        if (emprendedorId == null) {
            throw new DomainValidationException("emprendedorId", "no puede ser nulo");
        }
        if (ubicacion == null) {
            throw new DomainValidationException("ubicacion", "no puede ser nula");
        }
        // Invariante central RF10: la fecha debe ser estrictamente futura
        if (fechaHora == null || !fechaHora.isAfter(LocalDateTime.now())) {
            throw new FechaServicioInvalidaException(fechaHora);
        }

        return new Servicio(UUID.randomUUID(), nombre.trim(), descripcion.trim(),
                fechaHora, ubicacion, emprendedorId);
    }

    /**
     * Reconstituye un Servicio desde persistencia sin validar la fecha (puede ser pasada).
     * Solo debe ser invocado por adaptadores de infraestructura.
     */
    public static Servicio reconstituir(UUID id, String nombre, String descripcion,
                                         LocalDateTime fechaHora, Ubicacion ubicacion, UUID emprendedorId) {
        return new Servicio(id, nombre, descripcion, fechaHora, ubicacion, emprendedorId);
    }

    public UUID getId() { return id; }
    public String getNombre() { return nombre; }
    public String getDescripcion() { return descripcion; }
    public LocalDateTime getFechaHora() { return fechaHora; }
    public Ubicacion getUbicacion() { return ubicacion; }
    public UUID getEmprendedorId() { return emprendedorId; }
}
