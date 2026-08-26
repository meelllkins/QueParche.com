package com.queparche.domain.servicio.vo;

import com.queparche.domain.shared.exception.DomainValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Ubicacion VO (RF10)")
class UbicacionTest {

    private static final double LAT_MEDELLIN = 6.2442;
    private static final double LNG_MEDELLIN = -75.5812;
    private static final String DIR_VALIDA   = "Calle 10 #43-12, El Poblado, Medellín";

    // ─── Casos válidos ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Cuando las coordenadas son válidas")
    class CoordenadasValidas {

        @Test
        @DisplayName("acepta coordenadas reales de Medellín")
        void aceptaCoordenadasMedellin() {
            Ubicacion u = new Ubicacion(LAT_MEDELLIN, LNG_MEDELLIN, DIR_VALIDA);
            assertEquals(LAT_MEDELLIN, u.getLatitud());
            assertEquals(LNG_MEDELLIN, u.getLongitud());
            assertEquals(DIR_VALIDA, u.getDireccion());
        }

        @Test
        @DisplayName("acepta latitud en el límite superior exacto (90.0)")
        void aceptaLatitudLimiteSuperior() {
            assertDoesNotThrow(() -> new Ubicacion(90.0, 0.0, DIR_VALIDA));
        }

        @Test
        @DisplayName("acepta latitud en el límite inferior exacto (-90.0)")
        void aceptaLatitudLimiteInferior() {
            assertDoesNotThrow(() -> new Ubicacion(-90.0, 0.0, DIR_VALIDA));
        }

        @Test
        @DisplayName("acepta longitud en el límite superior exacto (180.0)")
        void aceptaLongitudLimiteSuperior() {
            assertDoesNotThrow(() -> new Ubicacion(0.0, 180.0, DIR_VALIDA));
        }

        @Test
        @DisplayName("acepta longitud en el límite inferior exacto (-180.0)")
        void aceptaLongitudLimiteInferior() {
            assertDoesNotThrow(() -> new Ubicacion(0.0, -180.0, DIR_VALIDA));
        }

        @Test
        @DisplayName("acepta latitud y longitud en cero (Ecuador / Meridiano de Greenwich)")
        void aceptaCoordenadaCero() {
            assertDoesNotThrow(() -> new Ubicacion(0.0, 0.0, DIR_VALIDA));
        }
    }

    // ─── Latitud fuera de rango ───────────────────────────────────────────────

    @Nested
    @DisplayName("Rechaza latitud fuera de rango [-90, 90]")
    class RechazoLatitudFueraDeRango {

        @Test
        @DisplayName("rechaza latitud = 100 (ejemplo explícito del enunciado)")
        void rechazaLatitud100() {
            DomainValidationException ex = assertThrows(
                    DomainValidationException.class,
                    () -> new Ubicacion(100.0, LNG_MEDELLIN, DIR_VALIDA)
            );
            assertTrue(ex.getMessage().contains("latitud"));
        }

        @Test
        @DisplayName("rechaza latitud = 90.001 (un epsilon sobre el límite)")
        void rechazaLatitudJusteEncimaDeLimite() {
            assertThrows(DomainValidationException.class,
                    () -> new Ubicacion(90.001, 0.0, DIR_VALIDA));
        }

        @Test
        @DisplayName("rechaza latitud = -90.001 (un epsilon bajo el límite)")
        void rechazaLatitudJusteBajoDeLimite() {
            assertThrows(DomainValidationException.class,
                    () -> new Ubicacion(-90.001, 0.0, DIR_VALIDA));
        }

        @ParameterizedTest(name = "[{index}] rechaza latitud = {0}")
        @CsvSource({
                "91.0,  0.0",
                "-91.0, 0.0",
                "180.0, 0.0",
                "-180.0,0.0"
        })
        @DisplayName("rechaza latitudes ampliamente fuera de rango")
        void rechazaLatitudesFueraDeRango(double lat, double lng) {
            assertThrows(DomainValidationException.class,
                    () -> new Ubicacion(lat, lng, DIR_VALIDA));
        }
    }

    // ─── Longitud fuera de rango ──────────────────────────────────────────────

    @Nested
    @DisplayName("Rechaza longitud fuera de rango [-180, 180]")
    class RechazoLongitudFueraDeRango {

        @Test
        @DisplayName("rechaza longitud = 180.001 (un epsilon sobre el límite)")
        void rechazaLongitudJusteEncimaDeLimite() {
            assertThrows(DomainValidationException.class,
                    () -> new Ubicacion(0.0, 180.001, DIR_VALIDA));
        }

        @Test
        @DisplayName("rechaza longitud = -180.001 (un epsilon bajo el límite)")
        void rechazaLongitudJusteBajoDeLimite() {
            assertThrows(DomainValidationException.class,
                    () -> new Ubicacion(0.0, -180.001, DIR_VALIDA));
        }

        @ParameterizedTest(name = "[{index}] rechaza longitud = {1}")
        @CsvSource({
                "0.0,  181.0",
                "0.0, -181.0",
                "0.0,  360.0"
        })
        @DisplayName("rechaza longitudes ampliamente fuera de rango")
        void rechazaLongitudesFueraDeRango(double lat, double lng) {
            assertThrows(DomainValidationException.class,
                    () -> new Ubicacion(lat, lng, DIR_VALIDA));
        }
    }

    // ─── Dirección inválida ───────────────────────────────────────────────────

    @Nested
    @DisplayName("Rechaza dirección nula o vacía")
    class RechazoDireccionInvalida {

        @Test
        @DisplayName("rechaza dirección null")
        void rechazaDireccionNull() {
            DomainValidationException ex = assertThrows(
                    DomainValidationException.class,
                    () -> new Ubicacion(LAT_MEDELLIN, LNG_MEDELLIN, null)
            );
            assertTrue(ex.getMessage().contains("direccion"));
        }

        @Test
        @DisplayName("rechaza dirección vacía")
        void rechazaDireccionVacia() {
            assertThrows(DomainValidationException.class,
                    () -> new Ubicacion(LAT_MEDELLIN, LNG_MEDELLIN, ""));
        }

        @Test
        @DisplayName("rechaza dirección de solo espacios")
        void rechazaDireccionSoloEspacios() {
            assertThrows(DomainValidationException.class,
                    () -> new Ubicacion(LAT_MEDELLIN, LNG_MEDELLIN, "   "));
        }
    }

    // ─── Igualdad por valor ───────────────────────────────────────────────────

    @Nested
    @DisplayName("Igualdad por valor (Value Object)")
    class Igualdad {

        @Test
        @DisplayName("dos instancias con los mismos datos son iguales")
        void dosInstanciasIguales() {
            Ubicacion u1 = new Ubicacion(LAT_MEDELLIN, LNG_MEDELLIN, DIR_VALIDA);
            Ubicacion u2 = new Ubicacion(LAT_MEDELLIN, LNG_MEDELLIN, DIR_VALIDA);
            assertEquals(u1, u2);
            assertEquals(u1.hashCode(), u2.hashCode());
        }

        @Test
        @DisplayName("latitudes distintas no son iguales")
        void latitudesDistintasNoIguales() {
            Ubicacion u1 = new Ubicacion(6.0, LNG_MEDELLIN, DIR_VALIDA);
            Ubicacion u2 = new Ubicacion(7.0, LNG_MEDELLIN, DIR_VALIDA);
            assertNotEquals(u1, u2);
        }

        @Test
        @DisplayName("longitudes distintas no son iguales")
        void longitugesDistintasNoIguales() {
            Ubicacion u1 = new Ubicacion(LAT_MEDELLIN, -75.0, DIR_VALIDA);
            Ubicacion u2 = new Ubicacion(LAT_MEDELLIN, -76.0, DIR_VALIDA);
            assertNotEquals(u1, u2);
        }

        @Test
        @DisplayName("toString incluye la dirección")
        void toStringContienesDireccion() {
            Ubicacion u = new Ubicacion(LAT_MEDELLIN, LNG_MEDELLIN, DIR_VALIDA);
            assertTrue(u.toString().contains(DIR_VALIDA));
        }
    }
}
