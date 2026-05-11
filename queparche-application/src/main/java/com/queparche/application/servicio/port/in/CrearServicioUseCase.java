package com.queparche.application.servicio.port.in;

import com.queparche.application.servicio.ServicioCommand;
import com.queparche.domain.servicio.Servicio;

public interface CrearServicioUseCase {

    Servicio crear(ServicioCommand command);
}
