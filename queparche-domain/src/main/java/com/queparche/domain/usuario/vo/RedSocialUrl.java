package com.queparche.domain.usuario.vo;

import com.queparche.domain.shared.exception.DomainValidationException;

import java.util.Objects;
import java.util.regex.Pattern;

public final class RedSocialUrl {

    private static final Pattern PATRON = Pattern.compile(
            "^https?://(www\\.)?(facebook\\.com|instagram\\.com|twitter\\.com|x\\.com" +
            "|linkedin\\.com|tiktok\\.com|youtube\\.com)(/\\S*)?$",
            Pattern.CASE_INSENSITIVE
    );

    private final String valor;

    public RedSocialUrl(String valor) {
        if (valor == null || valor.isBlank()) {
            throw new DomainValidationException("redSocialUrl", "no puede ser nula ni vacía");
        }
        if (!PATRON.matcher(valor.trim()).matches()) {
            throw new DomainValidationException(
                    "redSocialUrl",
                    "dominio no permitido. Solo se aceptan: facebook, instagram, twitter/x, linkedin, tiktok, youtube. Valor: " + valor
            );
        }
        this.valor = valor.trim();
    }

    public String getValor() {
        return valor;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RedSocialUrl that)) return false;
        return Objects.equals(valor, that.valor);
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
