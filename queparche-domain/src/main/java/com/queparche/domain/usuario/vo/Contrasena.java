package com.queparche.domain.usuario.vo;

import com.queparche.domain.shared.exception.DomainValidationException;

import java.util.Objects;

public final class Contrasena {

    private static final int LONGITUD_MINIMA = 8;

    // El dominio valida la contraseña en crudo. El hash es responsabilidad de la infraestructura.
    private final String valorCrudo;

    public Contrasena(String valorCrudo) {
        if (valorCrudo == null || valorCrudo.isBlank()) {
            throw new DomainValidationException("contrasena", "no puede ser nula ni vacía");
        }
        if (valorCrudo.length() < LONGITUD_MINIMA) {
            throw new DomainValidationException(
                    "contrasena",
                    "debe tener al menos " + LONGITUD_MINIMA + " caracteres"
            );
        }
        this.valorCrudo = valorCrudo;
    }

    public String getValorCrudo() {
        return valorCrudo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Contrasena that)) return false;
        return Objects.equals(valorCrudo, that.valorCrudo);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valorCrudo);
    }

    // toString deliberadamente omitido: nunca exponer la contraseña en logs
}
