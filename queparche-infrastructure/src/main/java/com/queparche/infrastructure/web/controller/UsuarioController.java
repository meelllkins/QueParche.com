package com.queparche.infrastructure.web.controller;

import com.queparche.application.usuario.ActualizarPerfilCommand;
import com.queparche.application.usuario.UsuarioCommand;
import com.queparche.application.usuario.port.in.ActualizarPerfilUseCase;
import com.queparche.application.usuario.port.in.RegistrarUsuarioUseCase;
import com.queparche.domain.usuario.TipoRol;
import com.queparche.domain.usuario.Usuario;
import com.queparche.infrastructure.web.dto.request.ActualizarPerfilRequest;
import com.queparche.infrastructure.web.dto.request.RegistrarClienteRequest;
import com.queparche.infrastructure.web.dto.request.RegistrarEmprendedorRequest;
import com.queparche.infrastructure.web.dto.response.BaseResponse;
import com.queparche.infrastructure.web.dto.response.UsuarioResponse;
import com.queparche.infrastructure.web.mapper.UsuarioWebMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {

    private final RegistrarUsuarioUseCase registrarUseCase;
    private final ActualizarPerfilUseCase actualizarPerfilUseCase;

    public UsuarioController(RegistrarUsuarioUseCase registrarUseCase,
                              ActualizarPerfilUseCase actualizarPerfilUseCase) {
        this.registrarUseCase = registrarUseCase;
        this.actualizarPerfilUseCase = actualizarPerfilUseCase;
    }

    // RF02 — Registro simple de cliente
    @PostMapping("/clientes")
    public ResponseEntity<BaseResponse<UsuarioResponse>> registrarCliente(
            @RequestBody RegistrarClienteRequest request) {
        Usuario usuario = registrarUseCase.registrar(
                new UsuarioCommand(request.nombre(), request.email(), request.contrasena(), TipoRol.CLIENTE)
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.of(HttpStatus.CREATED.value(), "Cliente registrado exitosamente",
                        UsuarioWebMapper.toResponse(usuario)));
    }

    // RF06 — Registro de emprendedor
    @PostMapping("/emprendedores")
    public ResponseEntity<BaseResponse<UsuarioResponse>> registrarEmprendedor(
            @RequestBody RegistrarEmprendedorRequest request) {
        Usuario usuario = registrarUseCase.registrar(
                new UsuarioCommand(request.nombre(), request.email(), request.contrasena(), TipoRol.EMPRENDEDOR)
        );
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(BaseResponse.of(HttpStatus.CREATED.value(), "Emprendedor registrado exitosamente",
                        UsuarioWebMapper.toResponse(usuario)));
    }

    // RF03 & RF07 — Actualización de perfil
    @PutMapping("/{uuid}/perfil")
    public ResponseEntity<BaseResponse<UsuarioResponse>> actualizarPerfil(
            @PathVariable UUID uuid,
            @RequestBody ActualizarPerfilRequest request) {
        Usuario usuario = actualizarPerfilUseCase.actualizar(
                new ActualizarPerfilCommand(uuid, request.telefono(), request.correoSecundario(), request.redesSociales())
        );
        return ResponseEntity.ok(
                BaseResponse.of(HttpStatus.OK.value(), "Perfil actualizado exitosamente",
                        UsuarioWebMapper.toResponse(usuario)));
    }
}
