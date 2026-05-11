package com.queparche.application.usuario;

import com.queparche.application.shared.exception.EmailYaRegistradoException;
import com.queparche.domain.shared.exception.DomainValidationException;
import com.queparche.domain.usuario.TipoRol;
import com.queparche.domain.usuario.Usuario;
import com.queparche.domain.usuario.port.out.UsuarioRepositoryPort;
import com.queparche.domain.usuario.vo.Email;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("RegistrarUsuarioService — RF02")
class RegistrarUsuarioServiceTest {

    @Mock
    private UsuarioRepositoryPort repositorio;

    private RegistrarUsuarioService service;

    @BeforeEach
    void setUp() {
        service = new RegistrarUsuarioService(repositorio);
    }

    // ─── Flujo feliz: CLIENTE ─────────────────────────────────────────────────

    @Nested
    @DisplayName("Registro exitoso de Cliente")
    class RegistroExitosoCliente {

        @Test
        @DisplayName("retorna el Usuario creado con rol CLIENTE")
        void retornaUsuarioCliente() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(false);

            UsuarioCommand command = new UsuarioCommand(
                    "Ana Gómez", "ana@queparche.com", "Segura123!", TipoRol.CLIENTE
            );
            Usuario resultado = service.registrar(command);

            assertNotNull(resultado);
            assertEquals(TipoRol.CLIENTE, resultado.getRol());
            assertTrue(resultado.esCliente());
        }

        @Test
        @DisplayName("persiste el usuario exactamente una vez")
        void persisteUnaVez() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(false);

            service.registrar(new UsuarioCommand(
                    "Ana Gómez", "ana@queparche.com", "Segura123!", TipoRol.CLIENTE
            ));

            verify(repositorio, times(1)).guardar(any(Usuario.class));
        }

        @Test
        @DisplayName("guarda el usuario con el email normalizado")
        void guardaConEmailNormalizado() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(false);
            ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);

            service.registrar(new UsuarioCommand(
                    "Ana Gómez", "ANA@QUEPARCHE.COM", "Segura123!", TipoRol.CLIENTE
            ));

            verify(repositorio).guardar(captor.capture());
            assertEquals("ana@queparche.com", captor.getValue().getEmail().getValor());
        }

        @Test
        @DisplayName("el Usuario retornado tiene un UUID no nulo")
        void retornaUuidNoNulo() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(false);

            Usuario resultado = service.registrar(new UsuarioCommand(
                    "Ana Gómez", "ana@queparche.com", "Segura123!", TipoRol.CLIENTE
            ));

            assertNotNull(resultado.getId());
        }
    }

    // ─── Flujo feliz: EMPRENDEDOR ─────────────────────────────────────────────

    @Nested
    @DisplayName("Registro exitoso de Emprendedor")
    class RegistroExitosoEmprendedor {

        @Test
        @DisplayName("retorna el Usuario creado con rol EMPRENDEDOR")
        void retornaUsuarioEmprendedor() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(false);

            Usuario resultado = service.registrar(new UsuarioCommand(
                    "Carlos Ruiz", "carlos@queparche.com", "Segura123!", TipoRol.EMPRENDEDOR
            ));

            assertEquals(TipoRol.EMPRENDEDOR, resultado.getRol());
            assertTrue(resultado.esEmprendedor());
            assertTrue(resultado.getRol().puedeGestionarServicios());
        }

        @Test
        @DisplayName("persiste exactamente una vez y no llama al repositorio con rol CLIENTE")
        void persisteEmprendedorCorrectamente() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(false);
            ArgumentCaptor<Usuario> captor = ArgumentCaptor.forClass(Usuario.class);

            service.registrar(new UsuarioCommand(
                    "Carlos Ruiz", "carlos@queparche.com", "Segura123!", TipoRol.EMPRENDEDOR
            ));

            verify(repositorio).guardar(captor.capture());
            assertFalse(captor.getValue().esCliente());
        }
    }

    // ─── Email duplicado ──────────────────────────────────────────────────────

    @Nested
    @DisplayName("Email ya registrado")
    class EmailDuplicado {

        @Test
        @DisplayName("lanza EmailYaRegistradoException si el email existe")
        void lanzaExcepcionEmailDuplicado() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(true);

            UsuarioCommand command = new UsuarioCommand(
                    "Ana Gómez", "ana@queparche.com", "Segura123!", TipoRol.CLIENTE
            );

            EmailYaRegistradoException ex = assertThrows(
                    EmailYaRegistradoException.class,
                    () -> service.registrar(command)
            );
            assertTrue(ex.getMessage().contains("ana@queparche.com"));
        }

        @Test
        @DisplayName("no persiste nada si el email ya existe")
        void noPersisteSiEmailExiste() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(true);

            assertThrows(EmailYaRegistradoException.class, () ->
                    service.registrar(new UsuarioCommand(
                            "Ana Gómez", "ana@queparche.com", "Segura123!", TipoRol.CLIENTE
                    ))
            );

            verify(repositorio, never()).guardar(any());
        }

        @Test
        @DisplayName("la consulta de existencia normaliza el email antes de comparar")
        void consultaConEmailNormalizado() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(true);
            ArgumentCaptor<Email> captor = ArgumentCaptor.forClass(Email.class);

            assertThrows(EmailYaRegistradoException.class, () ->
                    service.registrar(new UsuarioCommand(
                            "Ana Gómez", "ANA@QUEPARCHE.COM", "Segura123!", TipoRol.CLIENTE
                    ))
            );

            verify(repositorio).existePorEmail(captor.capture());
            assertEquals("ana@queparche.com", captor.getValue().getValor());
        }
    }

    // ─── Propagación de validaciones del dominio ──────────────────────────────

    @Nested
    @DisplayName("Propagación de DomainValidationException")
    class PropagacionValidaciones {

        @Test
        @DisplayName("email inválido lanza DomainValidationException antes de consultar el repositorio")
        void emailInvalidoFallaAntesDeLlegarAlRepositorio() {
            assertThrows(DomainValidationException.class, () ->
                    service.registrar(new UsuarioCommand(
                            "Ana Gómez", "no-es-email", "Segura123!", TipoRol.CLIENTE
                    ))
            );

            verify(repositorio, never()).existePorEmail(any());
            verify(repositorio, never()).guardar(any());
        }

        @Test
        @DisplayName("contraseña corta lanza DomainValidationException")
        void contrasenaCortaFalla() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(false);

            assertThrows(DomainValidationException.class, () ->
                    service.registrar(new UsuarioCommand(
                            "Ana Gómez", "ana@queparche.com", "corta", TipoRol.CLIENTE
                    ))
            );

            verify(repositorio, never()).guardar(any());
        }

        @Test
        @DisplayName("nombre nulo lanza DomainValidationException")
        void nombreNuloFalla() {
            when(repositorio.existePorEmail(any(Email.class))).thenReturn(false);

            assertThrows(DomainValidationException.class, () ->
                    service.registrar(new UsuarioCommand(
                            null, "ana@queparche.com", "Segura123!", TipoRol.CLIENTE
                    ))
            );

            verify(repositorio, never()).guardar(any());
        }
    }
}
