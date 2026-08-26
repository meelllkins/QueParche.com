package com.queparche.domain.servicio.exception;

import java.time.LocalDateTime;

public class FechaServicioInvalidaException extends RuntimeException {

    public FechaServicioInvalidaException(LocalDateTime fecha) {
        super("La fechaHora del servicio debe ser futura. Valor recibido: " + fecha);
    }
}
