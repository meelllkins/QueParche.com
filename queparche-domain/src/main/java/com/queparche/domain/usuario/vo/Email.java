package com.queparche.domain.usuario.vo;

import com.queparche.domain.shared.exception.DomainValidationException;

import java.util.Objects;
import java.util.regex.Pattern;

public final class Email {

    // RFC 5322 simplificado: dominio con al menos un punto y TLD de 2+ letras
    private static final Pattern PATRON_EMAIL = Pattern.compile(
            "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$"
    );

    private final String valor;

    public Email(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new DomainValidationException("email", "no puede ser nulo ni vacío");
        }
        String normalizado = valor.trim().toLowerCase();
        if (!PATRON_EMAIL.matcher(normalizado).matches()) {
            throw new DomainValidationException("email", "formato inválido: " + valor);
        }
        this.valor = normalizado;
    }

    public String getValor() {
        return valor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Email email)) return false;
        return Objects.equals(valor, email.valor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(valor);
    }

    @Override
    public String toString() {
        return valor;
    }
}
