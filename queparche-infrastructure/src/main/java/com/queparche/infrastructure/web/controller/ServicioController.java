package com.queparche.infrastructure.web.controller;

import com.queparche.application.servicio.ServicioCommand;
import com.queparche.application.servicio.port.in.CrearServicioUseCase;
import com.queparche.domain.servicio.Servicio;
import com.queparche.infrastructure.web.dto.request.CrearServicioRequest;
import com.queparche.infrastructure.web.dto.response.BaseResponse;
import com.queparche.infrastructure.web.dto.response.ServicioResponse;
import com.queparche.infrastructure.web.mapper.ServicioWebMapper;
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

    // RF10 — Publicación de información del servicio
    @PostMapping
    public ResponseEntity<BaseResponse<ServicioResponse>> crearServicio(
            @RequestBody CrearServicioRequest request) {
        Servicio servicio = crearServicioUseCase.crear(new ServicioCommand(
                request.emprendedorId(), request.nombre(), request.descripcion(),
                request.fechaHora(), request.latitud(), request.longitud(), request.direccion()
        ));
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.of(HttpStatus.CREATED.value(), "Servicio creado exitosamente",
                        ServicioWebMapper.toResponse(servicio)));
    }
}
