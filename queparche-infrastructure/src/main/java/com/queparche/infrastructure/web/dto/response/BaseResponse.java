package com.queparche.infrastructure.web.dto.response;

import java.time.Instant;

// R01: envoltorio unificado para todos los endpoints REST
public record BaseResponse<T>(
        String timestamp,
        int status,
        String message,
        T data
) {

    public static <T> BaseResponse<T> of(int status, String message, T data) {
        return new BaseResponse<>(Instant.now().toString(), status, message, data);
    }
}
