package com.queparche.infrastructure.web.controller;

import com.queparche.application.servicio.ServicioCommand;
import com.queparche.application.servicio.port.in.CrearServicioUseCase;
import com.queparche.domain.servicio.Servicio;
import com.queparche.infrastructure.persistence.mapper.ServicioMapper;
import com.queparche.infrastructure.web.dto.request.CrearServicioRequest;
import com.queparche.infrastructure.web.dto.response.ServicioResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/servicios")
public class ServicioController {

    private final CrearServicioUseCase crearServicioUseCase;

    public ServicioController(CrearServicioUseCase crearServicioUseCase) {
        this.crearServicioUseCase = crearServicioUseCase;
    }

    // RF10
    @PostMapping
    public ResponseEntity<ServicioResponse> crearServicio(@RequestBody CrearServicioRequest request) {
        Servicio servicio = crearServicioUseCase.crear(new ServicioCommand(
                request.emprendedorId(), request.nombre(), request.descripcion(),
                request.fechaHora(), request.latitud(), request.longitud(), request.direccion()
        ));
        return ResponseEntity.status(HttpStatus.CREATED).body(ServicioMapper.toResponse(servicio));
    }
}
