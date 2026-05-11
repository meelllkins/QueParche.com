package com.queparche.domain.servicio;

import com.queparche.domain.servicio.exception.FechaServicioInvalidaException;
import com.queparche.domain.servicio.vo.Ubicacion;
import com.queparche.domain.shared.exception.DomainValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Servicio — Aggregate Root (RF10)")
class ServicioTest {

    private static final Ubicacion UBICACION_VALIDA =
            new Ubicacion(6.2442, -75.5812, "Calle 10 #43-12, El Poblado, Medellín");
    private static final UUID EMPRENDEDOR_ID = UUID.randomUUID();
    private static final LocalDateTime FECHA_FUTURA = LocalDateTime.now().plusDays(7);

    // ─── Creación exitosa ─────────────────────────────────────────────────────

    @Nested
    @DisplayName("Creación válida de un Servicio")
    class CreacionValida {

        @Test
        @DisplayName("crea el servicio con todos los campos correctos")
        void creaServicioValido() {
            Servicio s = Servicio.crear("Clases de cocina", "Aprende cocina antioqueña",
                    FECHA_FUTURA, UBICACION_VALIDA, EMPRENDEDOR_ID);

            assertNotNull(s.getId());
            assertEquals("Clases de cocina", s.getNombre());
            assertEquals("Aprende cocina antioqueña", s.getDescripcion());
            assertEquals(FECHA_FUTURA, s.getFechaHora());
            assertEquals(UBICACION_VALIDA, s.getUbicacion());
            assertEquals(EMPRENDEDOR_ID, s.getEmprendedorId());
        }

        @Test
        @DisplayName("genera UUID único por cada instancia")
        void generaUuidUnico() {
            Servicio s1 = Servicio.crear("S1", "Desc1", FECHA_FUTURA, UBICACION_VALIDA, EMPRENDEDOR_ID);
            Servicio s2 = Servicio.crear("S2", "Desc2", FECHA_FUTURA, UBICACION_VALIDA, EMPRENDEDOR_ID);
            assertNotEquals(s1.getId(), s2.getId());
        }

        @Test
        @DisplayName("recorta espacios del nombre y descripción")
        void recortaEspacios() {
            Servicio s = Servicio.crear("  Taller de arte  ", "  Pintura  ",
                    FECHA_FUTURA, UBICACION_VALIDA, EMPRENDEDOR_ID);
            assertEquals("Taller de arte", s.getNombre());
            assertEquals("Pintura", s.getDescripcion());
        }

        @Test
        @DisplayName("acepta fecha exactamente un segundo en el futuro (límite inferior)")
        void aceptaFechaUnSegundoFutura() {
            LocalDateTime unSegundoFuturo = LocalDateTime.now().plusSeconds(2);
            assertDoesNotThrow(() ->
                    Servicio.crear("Servicio", "Desc", unSegundoFuturo, UBICACION_VALIDA, EMPRENDEDOR_ID)
            );
        }
    }

    // ─── Invariante: fecha debe ser futura ────────────────────────────────────

    @Nested
    @DisplayName("Invariante: fechaHora debe ser futura")
    class InvarianteFechaFutura {

        @Test
        @DisplayName("rechaza fecha en el pasado (ayer)")
        void rechazaFechaPasada() {
            LocalDateTime ayer = LocalDateTime.now().minusDays(1);
            FechaServicioInvalidaException ex = assertThrows(
                    FechaServicioInvalidaException.class,
                    () -> Servicio.crear("Taller", "Desc", ayer, UBICACION_VALIDA, EMPRENDEDOR_ID)
            );
            assertTrue(ex.getMessage().contains(ayer.toString()));
        }

        @Test
        @DisplayName("rechaza fecha de hace un minuto")
        void rechazaFechaUnMinutoAtras() {
            assertThrows(FechaServicioInvalidaException.class,
                    () -> Servicio.crear("Taller", "Desc",
                            LocalDateTime.now().minusMinutes(1), UBICACION_VALIDA, EMPRENDEDOR_ID));
        }

        @Test
        @DisplayName("rechaza null como fechaHora")
        void rechazaFechaNull() {
            FechaServicioInvalidaException ex = assertThrows(
                    FechaServicioInvalidaException.class,
                    () -> Servicio.crear("Taller", "Desc", null, UBICACION_VALIDA, EMPRENDEDOR_ID)
            );
            assertTrue(ex.getMessage().contains("null"));
        }
    }

    // ─── Validaciones de campos obligatorios ──────────────────────────────────

    @Nested
    @DisplayName("Validaciones de campos obligatorios")
    class ValidacionesCampos {

        @Test
        @DisplayName("rechaza nombre null")
        void rechazaNombreNull() {
            assertThrows(DomainValidationException.class,
                    () -> Servicio.crear(null, "Desc", FECHA_FUTURA, UBICACION_VALIDA, EMPRENDEDOR_ID));
        }

        @Test
        @DisplayName("rechaza nombre en blanco")
        void rechazaNombreBlanco() {
            assertThrows(DomainValidationException.class,
                    () -> Servicio.crear("   ", "Desc", FECHA_FUTURA, UBICACION_VALIDA, EMPRENDEDOR_ID));
        }

        @Test
        @DisplayName("rechaza descripción null")
        void rechazaDescripcionNull() {
            assertThrows(DomainValidationException.class,
                    () -> Servicio.crear("Nombre", null, FECHA_FUTURA, UBICACION_VALIDA, EMPRENDEDOR_ID));
        }

        @Test
        @DisplayName("rechaza descripción en blanco")
        void rechazaDescripcionBlanco() {
            assertThrows(DomainValidationException.class,
                    () -> Servicio.crear("Nombre", "   ", FECHA_FUTURA, UBICACION_VALIDA, EMPRENDEDOR_ID));
        }

        @Test
        @DisplayName("rechaza emprendedorId null")
        void rechazaEmprendedorIdNull() {
            assertThrows(DomainValidationException.class,
                    () -> Servicio.crear("Nombre", "Desc", FECHA_FUTURA, UBICACION_VALIDA, null));
        }

        @Test
        @DisplayName("rechaza ubicacion null")
        void rechazaUbicacionNull() {
            assertThrows(DomainValidationException.class,
                    () -> Servicio.crear("Nombre", "Desc", FECHA_FUTURA, null, EMPRENDEDOR_ID));
        }
    }
}
