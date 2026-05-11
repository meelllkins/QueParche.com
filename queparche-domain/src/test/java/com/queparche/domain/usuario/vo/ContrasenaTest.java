package com.queparche.domain.usuario.vo;

import com.queparche.domain.shared.exception.DomainValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Contrasena VO")
class ContrasenaTest {

    // ─── Casos válidos ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Cuando la contraseña es válida")
    class ContrasenaValida {

        @Test
        @DisplayName("acepta exactamente 8 caracteres (valor límite inferior)")
        void aceptaExactamenteOchoCaracteres() {
            assertDoesNotThrow(() -> new Contrasena("12345678"));
        }

        @ParameterizedTest(name = "[{index}] acepta contraseña de longitud válida: \"{0}\"")
        @ValueSource(strings = {
                "12345678",           // límite exacto
                "123456789",          // 9 chars
                "contrasenaSegura1",  // alfanumérica
                "P@$$w0rd!#",         // con caracteres especiales
                "una contrasena con espacios y mas de ocho"
        })
        @DisplayName("acepta contraseñas de 8 o más caracteres")
        void aceptaContrasenasSuficientementeLargas(String valor) {
            assertDoesNotThrow(() -> new Contrasena(valor));
        }

        @Test
        @DisplayName("getValorCrudo devuelve el valor original sin modificación")
        void getValorCrudoDevuelveValorOriginal() {
            String raw = "MiClave123!";
            Contrasena contrasena = new Contrasena(raw);
            assertEquals(raw, contrasena.getValorCrudo());
        }
    }

    // ─── Regla de 8 caracteres mínimos ───────────────────────────────────────

    @Nested
    @DisplayName("Rechaza contraseñas menores a 8 caracteres")
    class RechazoLongitudInsuficiente {

        @Test
        @DisplayName("rechaza contraseña de 7 caracteres (un por debajo del límite)")
        void rechazaSieteCaracteres() {
            DomainValidationException ex = assertThrows(
                    DomainValidationException.class,
                    () -> new Contrasena("1234567")
            );
            assertTrue(ex.getMessage().contains("contrasena") || ex.getMessage().contains("8"));
        }

        @ParameterizedTest(name = "[{index}] rechaza contraseña de {0} caracteres")
        @ValueSource(strings = {
                "a",        // 1 char
                "ab",       // 2 chars
                "abc123",   // 6 chars
                "1234567"   // 7 chars
        })
        @DisplayName("rechaza contraseñas de 1 a 7 caracteres")
        void rechazaContrasenasCortas(String valor) {
            assertThrows(DomainValidationException.class, () -> new Contrasena(valor));
        }
    }

    // ─── Rechazos por nulo / vacío ────────────────────────────────────────────

    @Nested
    @DisplayName("Rechaza nulo y vacío")
    class RechazoNuloVacio {

        @Test
        @DisplayName("rechaza null")
        void rechazaNull() {
            DomainValidationException ex = assertThrows(
                    DomainValidationException.class,
                    () -> new Contrasena(null)
            );
            assertTrue(ex.getMessage().contains("contrasena"));
        }

        @Test
        @DisplayName("rechaza cadena vacía")
        void rechazaVacio() {
            assertThrows(DomainValidationException.class, () -> new Contrasena(""));
        }

        @Test
        @DisplayName("rechaza cadena de solo espacios")
        void rechazaSoloEspacios() {
            assertThrows(DomainValidationException.class, () -> new Contrasena("   "));
        }
    }

    // ─── Seguridad: no exponer contraseña en toString ─────────────────────────

    @Nested
    @DisplayName("Seguridad: toString no expone el valor")
    class SeguridadToString {

        @Test
        @DisplayName("toString no contiene el valor crudo de la contraseña")
        void toStringNoExponeLaContrasena() {
            String secreto = "MiSecreto123";
            Contrasena contrasena = new Contrasena(secreto);
            // toString heredado de Object devuelve NombreClase@hashCode — nunca el valor
            assertFalse(contrasena.toString().contains(secreto));
        }
    }

    // ─── Igualdad por valor ───────────────────────────────────────────────────

    @Nested
    @DisplayName("Igualdad por valor (Value Object)")
    class Igualdad {

        @Test
        @DisplayName("dos instancias con el mismo valor son iguales")
        void dosInstanciasIguales() {
            Contrasena c1 = new Contrasena("miClave99!");
            Contrasena c2 = new Contrasena("miClave99!");
            assertEquals(c1, c2);
            assertEquals(c1.hashCode(), c2.hashCode());
        }

        @Test
        @DisplayName("contraseñas distintas no son iguales")
        void contrasenasDistintasNoIguales() {
            Contrasena c1 = new Contrasena("clave1234");
            Contrasena c2 = new Contrasena("clave5678");
            assertNotEquals(c1, c2);
        }
    }
}
