package com.queparche.infrastructure.web.controller;

import com.queparche.application.usuario.ActualizarPerfilCommand;
import com.queparche.application.usuario.UsuarioCommand;
import com.queparche.application.usuario.port.in.ActualizarPerfilUseCase;
import com.queparche.application.usuario.port.in.RegistrarUsuarioUseCase;
import com.queparche.domain.usuario.TipoRol;
import com.queparche.domain.usuario.Usuario;
import com.queparche.infrastructure.persistence.mapper.UsuarioMapper;
import com.queparche.infrastructure.web.dto.request.ActualizarPerfilRequest;
import com.queparche.infrastructure.web.dto.request.RegistrarClienteRequest;
import com.queparche.infrastructure.web.dto.request.RegistrarEmprendedorRequest;
import com.queparche.infrastructure.web.dto.response.UsuarioResponse;
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

    // RF02
    @PostMapping("/clientes")
    public ResponseEntity<UsuarioResponse> registrarCliente(@RequestBody RegistrarClienteRequest request) {
        Usuario usuario = registrarUseCase.registrar(
                new UsuarioCommand(request.nombre(), request.email(), request.contrasena(), TipoRol.CLIENTE)
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioMapper.toResponse(usuario));
    }

    // RF06
    @PostMapping("/emprendedores")
    public ResponseEntity<UsuarioResponse> registrarEmprendedor(@RequestBody RegistrarEmprendedorRequest request) {
        Usuario usuario = registrarUseCase.registrar(
                new UsuarioCommand(request.nombre(), request.email(), request.contrasena(), TipoRol.EMPRENDEDOR)
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(UsuarioMapper.toResponse(usuario));
    }

    // RF03 & RF07
    @PutMapping("/{uuid}/perfil")
    public ResponseEntity<UsuarioResponse> actualizarPerfil(@PathVariable UUID uuid,
                                                             @RequestBody ActualizarPerfilRequest request) {
        Usuario usuario = actualizarPerfilUseCase.actualizar(
                new ActualizarPerfilCommand(uuid, request.telefono(), request.correoSecundario(), request.redesSociales())
        );
        return ResponseEntity.ok(UsuarioMapper.toResponse(usuario));
    }
}
