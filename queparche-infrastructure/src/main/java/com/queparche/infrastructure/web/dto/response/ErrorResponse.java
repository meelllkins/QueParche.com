package com.queparche.infrastructure.web.dto.response;

import java.time.LocalDateTime;

public record ErrorResponse(String codigo, String mensaje, LocalDateTime timestamp) {

    public ErrorResponse(String codigo, String mensaje) {
        this(codigo, mensaje, LocalDateTime.now());
    }
}
