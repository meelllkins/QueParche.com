package com.queparche.application.servicio.port.in;

import com.queparche.application.servicio.ServicioListado;

import java.util.List;

/**
 * Puerto de entrada (driving port) para la lectura de servicios — RF10.
 * La capa web llama a esta interfaz; nunca al Service directamente.
 */
public interface ListarServiciosUseCase {

    List<ServicioListado> listar();
}
