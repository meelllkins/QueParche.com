package com.queparche.domain.usuario;

import com.queparche.domain.shared.exception.DomainValidationException;
import com.queparche.domain.usuario.vo.Contrasena;
import com.queparche.domain.usuario.vo.Email;
import com.queparche.domain.usuario.vo.RedSocialUrl;
import lombok.Getter;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Aggregate Root del contexto de Identidad.
 * Invariante: un Usuario siempre tiene email válido, contraseña de 8+ chars,
 * nombre no vacío y un rol explícito asignado en el momento de creación.
 */
@Getter
public class Usuario {

    private final UUID id;
    private final Email email;
    private Contrasena contrasena;
    private String nombre;
    private final TipoRol rol;

    // RF03 — campos de perfil de contacto (opcionales)
    private String telefono;
    private String correoSecundario;
    private Map<String, String> redesSociales = new HashMap<>();

    // Constructor privado: la creación pasa siempre por los métodos de fábrica
    private Usuario(UUID id, Email email, Contrasena contrasena, String nombre, TipoRol rol) {
        this.id = id;
        this.email = email;
        this.contrasena = contrasena;
        this.nombre = nombre;
        this.rol = rol;
    }

    // RF02: Registro de Cliente
    public static Usuario registrarCliente(String nombre, String email, String contrasena) {
        return crear(nombre, email, contrasena, TipoRol.CLIENTE);
    }

    // RF06: Registro de Emprendedor
    public static Usuario registrarEmprendedor(String nombre, String email, String contrasena) {
        return crear(nombre, email, contrasena, TipoRol.EMPRENDEDOR);
    }

    private static Usuario crear(String nombre, String email, String contrasena, TipoRol rol) {
        if (nombre == null || nombre.isBlank()) {
            throw new DomainValidationException("nombre", "no puede ser nulo ni vacío");
        }
        if (rol == null) {
            throw new DomainValidationException("rol", "debe especificarse explícitamente");
        }
        return new Usuario(
                UUID.randomUUID(),
                new Email(email),
                new Contrasena(contrasena),
                nombre.trim(),
                rol
        );
    }

    public boolean esEmprendedor() {
        return TipoRol.EMPRENDEDOR.equals(this.rol);
    }

    public boolean esCliente() {
        return TipoRol.CLIENTE.equals(this.rol);
    }

    // RF06: permite al Emprendedor o Cliente actualizar su contraseña respetando las mismas reglas
    public void cambiarContrasena(String nuevaContrasena) {
        this.contrasena = new Contrasena(nuevaContrasena);
    }

    // RF03 & RF07: actualiza el perfil de contacto validando cada URL de red social en el dominio
    public void actualizarPerfil(String telefono, String correoSecundario, Map<String, String> redesSociales) {
        this.telefono = (telefono != null && !telefono.isBlank()) ? telefono.trim() : null;

        if (correoSecundario != null && !correoSecundario.isBlank()) {
            this.correoSecundario = new Email(correoSecundario).getValor();
        } else {
            this.correoSecundario = null;
        }

        if (redesSociales != null && !redesSociales.isEmpty()) {
            Map<String, String> validadas = new HashMap<>();
            redesSociales.forEach((plataforma, url) ->
                    validadas.put(plataforma, new RedSocialUrl(url).getValor())
            );
            this.redesSociales = validadas;
        } else {
            this.redesSociales = new HashMap<>();
        }
    }
}
