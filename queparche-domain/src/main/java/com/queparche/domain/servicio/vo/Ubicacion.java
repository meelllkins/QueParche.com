package com.queparche.domain.servicio.vo;

import com.queparche.domain.shared.exception.DomainValidationException;

import java.util.Objects;

/**
 * Value Object inmutable que representa la ubicación física de un Servicio.
 * No contiene lógica de geocodificación — esa responsabilidad pertenece a GeolocalizacionPort.
 */
public final class Ubicacion {

    private static final double LAT_MIN = -90.0;
    private static final double LAT_MAX = 90.0;
    private static final double LNG_MIN = -180.0;
    private static final double LNG_MAX = 180.0;

    private final double latitud;
    private final double longitud;
    private final String direccion;

    public Ubicacion(double latitud, double longitud, String direccion) {
        if (latitud < LAT_MIN || latitud > LAT_MAX) {
            throw new DomainValidationException(
                    "latitud", "debe estar entre " + LAT_MIN + " y " + LAT_MAX + ". Valor: " + latitud
            );
        }
        if (longitud < LNG_MIN || longitud > LNG_MAX) {
            throw new DomainValidationException(
                    "longitud", "debe estar entre " + LNG_MIN + " y " + LNG_MAX + ". Valor: " + longitud
            );
        }
        if (direccion == null || direccion.isBlank()) {
            throw new DomainValidationException("direccion", "no puede ser nula ni vacía");
        }
        this.latitud = latitud;
        this.longitud = longitud;
        this.direccion = direccion.trim();
    }

    public double getLatitud() { return latitud; }
    public double getLongitud() { return longitud; }
    public String getDireccion() { return direccion; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Ubicacion that)) return false;
        return Double.compare(latitud, that.latitud) == 0
                && Double.compare(longitud, that.longitud) == 0
                && Objects.equals(direccion, that.direccion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(latitud, longitud, direccion);
    }

    @Override
    public String toString() {
        return direccion + " (" + latitud + ", " + longitud + ")";
    }
}
