package com.queparche.application.usuario;

import com.queparche.application.shared.exception.UsuarioNoEncontradoException;
import com.queparche.domain.shared.exception.DomainValidationException;
import com.queparche.domain.usuario.TipoRol;
import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.port.out.UsuarioRepositoryPort;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ActualizarPerfilService — RF03 & RF07")
class ActualizarPerfilServiceTest {

    @Mock
    private UsuarioRepositoryPort repositorio;

    private ActualizarPerfilService service;
    private Usuario usuarioExistente;

    @BeforeEach
    void setUp() {
        service = new ActualizarPerfilService(repositorio);
        usuarioExistente = Usuario.registrarCliente("Ana Gómez", "ana@queparche.com", "Segura123!");
    }

    // ─── Flujo feliz ──────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Actualización exitosa de perfil")
    class ActualizacionExitosa {

        @Test
        @DisplayName("actualiza teléfono y lo persiste")
        void actualizaTelefono() {
            when(repositorio.buscarPorId(usuarioExistente.getId()))
                    .thenReturn(Optional.of(usuarioExistente));

            ActualizarPerfilCommand command = new ActualizarPerfilCommand(
                    usuarioExistente.getId(), "+57 300 123 4567", null, null
            );
            Usuario resultado = service.actualizar(command);

            assertEquals("+57 300 123 4567", resultado.getTelefono());
            verify(repositorio, times(1)).guardar(usuarioExistente);
        }

        @Test
        @DisplayName("actualiza correo secundario validado como Email VO")
        void actualizaCorreoSecundario() {
            when(repositorio.buscarPorId(usuarioExistente.getId()))
                    .thenReturn(Optional.of(usuarioExistente));

            ActualizarPerfilCommand command = new ActualizarPerfilCommand(
                    usuarioExistente.getId(), null, "ANA.BACKUP@GMAIL.COM", null
            );
            Usuario resultado = service.actualizar(command);

            // debe almacenarse normalizado a minúsculas (Email VO normaliza)
            assertEquals("ana.backup@gmail.com", resultado.getCorreoSecundario());
        }

        @Test
        @DisplayName("actualiza redes sociales con URLs válidas")
        void actualizaRedesSociales() {
            when(repositorio.buscarPorId(usuarioExistente.getId()))
                    .thenReturn(Optional.of(usuarioExistente));

            Map<String, String> redes = Map.of(
                    "instagram", "https://instagram.com/queparche",
                    "facebook",  "https://facebook.com/queparche"
            );
            ActualizarPerfilCommand command = new ActualizarPerfilCommand(
                    usuarioExistente.getId(), null, null, redes
            );
            Usuario resultado = service.actualizar(command);

            assertEquals("https://instagram.com/queparche", resultado.getRedesSociales().get("instagram"));
            assertEquals("https://facebook.com/queparche", resultado.getRedesSociales().get("facebook"));
        }

        @Test
        @DisplayName("persiste el mismo objeto Usuario que busca (no crea uno nuevo)")
        void persisteMismoObjeto() {
            when(repositorio.buscarPorId(usuarioExistente.getId()))
                    .thenReturn(Optional.of(usuarioExistente));
            ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);

            service.actualizar(new ActualizarPerfilCommand(
                    usuarioExistente.getId(), "300", null, null
            ));

            verify(repositorio).guardar(captor.capture());
            assertSame(usuarioExistente, captor.getValue());
        }

        @Test
        @DisplayName("actualización completa: todos los campos a la vez")
        void actualizacionCompleta() {
            when(repositorio.buscarPorId(usuarioExistente.getId()))
                    .thenReturn(Optional.of(usuarioExistente));

            ActualizarPerfilCommand command = new ActualizarPerfilCommand(
                    usuarioExistente.getId(),
                    "+57 310 000 0000",
                    "backup@correo.com",
                    Map.of("linkedin", "https://linkedin.com/in/ana")
            );
            Usuario resultado = service.actualizar(command);

            assertAll(
                    () -> assertEquals("+57 310 000 0000", resultado.getTelefono()),
                    () -> assertEquals("backup@correo.com", resultado.getCorreoSecundario()),
                    () -> assertEquals("https://linkedin.com/in/ana", resultado.getRedesSociales().get("linkedin"))
            );
        }
    }

    // ─── UUID no encontrado ───────────────────────────────────────────────────

    @Nested
    @DisplayName("Usuario no encontrado por UUID")
    class UsuarioNoEncontrado {

        @Test
        @DisplayName("lanza UsuarioNoEncontradoException si el UUID no existe")
        void lanzaExcepcionSiNoExiste() {
            UUID idInexistente = UUID.randomUUID();
            when(repositorio.buscarPorId(idInexistente)).thenReturn(Optional.empty());

            UsuarioNoEncontradoException ex = assertThrows(
                    UsuarioNoEncontradoException.class,
                    () -> service.actualizar(new ActualizarPerfilCommand(
                            idInexistente, "300", null, null
                    ))
            );
            assertTrue(ex.getMessage().contains(idInexistente.toString()));
        }

        @Test
        @DisplayName("no persiste nada si el UUID no existe")
        void noPersisteSiNoExiste() {
            when(repositorio.buscarPorId(any())).thenReturn(Optional.empty());

            assertThrows(UsuarioNoEncontradoException.class, () ->
                    service.actualizar(new ActualizarPerfilCommand(
                            UUID.randomUUID(), "300", null, null
                    ))
            );
            verify(repositorio, never()).guardar(any());
        }
    }

    // ─── Propagación de validaciones RF07 ────────────────────────────────────

    @Nested
    @DisplayName("Propagación de DomainValidationException — RF07")
    class PropagacionValidacionUrl {

        @Test
        @DisplayName("URL de dominio no permitido lanza DomainValidationException")
        void urlDominioNoPermitidoFalla() {
            when(repositorio.buscarPorId(usuarioExistente.getId()))
                    .thenReturn(Optional.of(usuarioExistente));

            assertThrows(DomainValidationException.class, () ->
                    service.actualizar(new ActualizarPerfilCommand(
                            usuarioExistente.getId(),
                            null, null,
                            Map.of("snap", "https://snapchat.com/usuario")
                    ))
            );
            verify(repositorio, never()).guardar(any());
        }

        @Test
        @DisplayName("correo secundario con formato inválido lanza DomainValidationException")
        void correoSecundarioInvalidoFalla() {
            when(repositorio.buscarPorId(usuarioExistente.getId()))
                    .thenReturn(Optional.of(usuarioExistente));

            assertThrows(DomainValidationException.class, () ->
                    service.actualizar(new ActualizarPerfilCommand(
                            usuarioExistente.getId(),
                            null, "no-es-un-email", null
                    ))
            );
            verify(repositorio, never()).guardar(any());
        }

        @Test
        @DisplayName("una URL inválida en el mapa rechaza toda la actualización")
        void unaUrlInvalidaRechazaTodo() {
            when(repositorio.buscarPorId(usuarioExistente.getId()))
                    .thenReturn(Optional.of(usuarioExistente));

            Map<String, String> redesMixtas = Map.of(
                    "instagram", "https://instagram.com/ok",
                    "malo",      "https://phishing.com/fake"
            );

            assertThrows(DomainValidationException.class, () ->
                    service.actualizar(new ActualizarPerfilCommand(
                            usuarioExistente.getId(), null, null, redesMixtas
                    ))
            );
            verify(repositorio, never()).guardar(any());
        }
    }

    // ─── Campos opcionales nulos ──────────────────────────────────────────────

    @Nested
    @DisplayName("Campos opcionales aceptan null")
    class CamposOpcionalesNulos {

        @Test
        @DisplayName("command con todos los campos de perfil nulos actualiza sin error")
        void commandTodoNulo() {
            when(repositorio.buscarPorId(usuarioExistente.getId()))
                    .thenReturn(Optional.of(usuarioExistente));

            assertDoesNotThrow(() -> service.actualizar(new ActualizarPerfilCommand(
                    usuarioExistente.getId(), null, null, null
            )));
            verify(repositorio, times(1)).guardar(any());
        }
    }
}
