package com.queparche.application.servicio;

import com.queparche.application.shared.exception.AccesoDenegadoException;
import com.queparche.domain.servicio.Servicio;
import com.queparche.domain.servicio.exception.FechaServicioInvalidaException;
import com.queparche.domain.servicio.port.out.ServicioRepositoryPort;
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

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CrearServicioService — RF10")
class CrearServicioServiceTest {

    @Mock private UsuarioRepositoryPort usuarioRepositorio;
    @Mock private ServicioRepositoryPort servicioRepositorio;

    private CrearServicioService service;

    private Usuario emprendedor;
    private Usuario cliente;
    private ServicioCommand commandValido;

    @BeforeEach
    void setUp() {
        service = new CrearServicioService(usuarioRepositorio, servicioRepositorio);

        emprendedor = Usuario.registrarEmprendedor("Carlos Ruiz", "carlos@queparche.com", "Segura123!");
        cliente     = Usuario.registrarCliente("Ana Gómez", "ana@queparche.com", "Segura123!");

        commandValido = new ServicioCommand(
                emprendedor.getId(),
                "Taller de cocina antioqueña",
                "Aprende los secretos de la cocina paisa",
                LocalDateTime.now().plusDays(7),
                6.2442, -75.5812,
                "Calle 10 #43-12, El Poblado, Medellín"
        );
    }

    // ─── Flujo exitoso ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Creación exitosa de Servicio")
    class CreacionExitosa {

        @Test
        @DisplayName("retorna el Servicio creado con los datos del command")
        void retornaServicioCreado() {
            when(usuarioRepositorio.buscarPorId(emprendedor.getId()))
                    .thenReturn(Optional.of(emprendedor));

            Servicio resultado = service.crear(commandValido);

            assertNotNull(resultado);
            assertNotNull(resultado.getId());
            assertEquals("Taller de cocina antioqueña", resultado.getNombre());
            assertEquals(emprendedor.getId(), resultado.getEmprendedorId());
        }

        @Test
        @DisplayName("persiste el Servicio exactamente una vez")
        void persisteUnaVez() {
            when(usuarioRepositorio.buscarPorId(emprendedor.getId()))
                    .thenReturn(Optional.of(emprendedor));

            service.crear(commandValido);

            verify(servicioRepositorio, times(1)).guardar(any(Servicio.class));
        }

        @Test
        @DisplayName("la Ubicacion persistida coincide con las coordenadas del command")
        void ubicacionCorrecta() {
            when(usuarioRepositorio.buscarPorId(emprendedor.getId()))
                    .thenReturn(Optional.of(emprendedor));
            ArgumentCaptor<Servicio> captor = ArgumentCaptor.forClass(Servicio.class);

            service.crear(commandValido);

            verify(servicioRepositorio).guardar(captor.capture());
            assertEquals(6.2442, captor.getValue().getUbicacion().getLatitud());
            assertEquals(-75.5812, captor.getValue().getUbicacion().getLongitud());
        }

        @Test
        @DisplayName("el Servicio generado tiene un UUID distinto al del Emprendedor")
        void uuidServicioDistintoAlEmprendedor() {
            when(usuarioRepositorio.buscarPorId(emprendedor.getId()))
                    .thenReturn(Optional.of(emprendedor));

            Servicio resultado = service.crear(commandValido);

            assertNotEquals(emprendedor.getId(), resultado.getId());
        }
    }

    // ─── Fallo 1: Usuario no existe ───────────────────────────────────────────

    @Nested
    @DisplayName("Fallo 1 — Usuario no encontrado")
    class UsuarioNoExiste {

        @Test
        @DisplayName("lanza AccesoDenegadoException si el UUID no existe en el repositorio")
        void lanzaAccesoDenegadoSiNoExiste() {
            UUID idInexistente = UUID.randomUUID();
            when(usuarioRepositorio.buscarPorId(idInexistente)).thenReturn(Optional.empty());

            ServicioCommand command = new ServicioCommand(
                    idInexistente, "Taller", "Desc",
                    LocalDateTime.now().plusDays(1),
                    6.0, -75.0, "Dirección"
            );

            AccesoDenegadoException ex = assertThrows(
                    AccesoDenegadoException.class,
                    () -> service.crear(command)
            );
            assertTrue(ex.getMessage().contains(idInexistente.toString()));
        }

        @Test
        @DisplayName("no persiste nada si el usuario no existe")
        void noPersisteSiNoExiste() {
            when(usuarioRepositorio.buscarPorId(any())).thenReturn(Optional.empty());

            assertThrows(AccesoDenegadoException.class, () -> service.crear(commandValido));

            verify(servicioRepositorio, never()).guardar(any());
        }
    }

    // ─── Fallo 2: Usuario es CLIENTE ─────────────────────────────────────────

    @Nested
    @DisplayName("Fallo 2 — Usuario con rol CLIENTE intenta crear servicio")
    class UsuarioEsCliente {

        @Test
        @DisplayName("lanza AccesoDenegadoException cuando el rol es CLIENTE")
        void lanzaAccesoDenegadoParaCliente() {
            when(usuarioRepositorio.buscarPorId(cliente.getId()))
                    .thenReturn(Optional.of(cliente));

            ServicioCommand commandCliente = new ServicioCommand(
                    cliente.getId(), "Taller", "Desc",
                    LocalDateTime.now().plusDays(1),
                    6.0, -75.0, "Dirección"
            );

            AccesoDenegadoException ex = assertThrows(
                    AccesoDenegadoException.class,
                    () -> service.crear(commandCliente)
            );
            assertTrue(ex.getMessage().contains(cliente.getId().toString()));
        }

        @Test
        @DisplayName("no persiste nada cuando el rol es CLIENTE")
        void noPersisteSiEsCliente() {
            when(usuarioRepositorio.buscarPorId(cliente.getId()))
                    .thenReturn(Optional.of(cliente));

            ServicioCommand commandCliente = new ServicioCommand(
                    cliente.getId(), "Taller", "Desc",
                    LocalDateTime.now().plusDays(1),
                    6.0, -75.0, "Dirección"
            );

            assertThrows(AccesoDenegadoException.class, () -> service.crear(commandCliente));

            verify(servicioRepositorio, never()).guardar(any());
        }

        @Test
        @DisplayName("segregación de roles: TipoRol.EMPRENDEDOR.puedeGestionarServicios() confirma la regla")
        void segregacionRolesVerificada() {
            assertFalse(TipoRol.CLIENTE.puedeGestionarServicios(),
                    "CLIENTE no debe poder gestionar servicios — invariante de segregación");
            assertTrue(TipoRol.EMPRENDEDOR.puedeGestionarServicios(),
                    "EMPRENDEDOR debe poder gestionar servicios");
        }
    }

    // ─── Fallo 3: Fecha en el pasado ──────────────────────────────────────────

    @Nested
    @DisplayName("Fallo 3 — FechaHora en el pasado")
    class FechaEnElPasado {

        @Test
        @DisplayName("lanza FechaServicioInvalidaException cuando la fecha es pasada")
        void lanzaExcepcionFechaPasada() {
            when(usuarioRepositorio.buscarPorId(emprendedor.getId()))
                    .thenReturn(Optional.of(emprendedor));

            ServicioCommand commandFechaPasada = new ServicioCommand(
                    emprendedor.getId(), "Taller", "Desc",
                    LocalDateTime.now().minusDays(1),
                    6.0, -75.0, "Dirección"
            );

            assertThrows(FechaServicioInvalidaException.class,
                    () -> service.crear(commandFechaPasada));
        }

        @Test
        @DisplayName("no persiste nada cuando la fecha es pasada")
        void noPersisteSiFechaInvalida() {
            when(usuarioRepositorio.buscarPorId(emprendedor.getId()))
                    .thenReturn(Optional.of(emprendedor));

            ServicioCommand commandFechaPasada = new ServicioCommand(
                    emprendedor.getId(), "Taller", "Desc",
                    LocalDateTime.now().minusHours(1),
                    6.0, -75.0, "Dirección"
            );

            assertThrows(FechaServicioInvalidaException.class,
                    () -> service.crear(commandFechaPasada));

            verify(servicioRepositorio, never()).guardar(any());
        }

        @Test
        @DisplayName("la autorización pasa antes de llegar a la validación de fecha")
        void autorizacionOcurreAntesQueFecha() {
            // con un UUID desconocido, AccesoDenegado debe lanzarse SIN llegar a la validación de fecha
            UUID idInexistente = UUID.randomUUID();
            when(usuarioRepositorio.buscarPorId(idInexistente)).thenReturn(Optional.empty());

            ServicioCommand commandFechaPasadaSinAcceso = new ServicioCommand(
                    idInexistente, "Taller", "Desc",
                    LocalDateTime.now().minusDays(1),
                    6.0, -75.0, "Dirección"
            );

            assertThrows(AccesoDenegadoException.class,
                    () -> service.crear(commandFechaPasadaSinAcceso),
                    "AccesoDenegado debe preceder a FechaServicioInvalida en el orden de validaciones");
        }
    }
}
