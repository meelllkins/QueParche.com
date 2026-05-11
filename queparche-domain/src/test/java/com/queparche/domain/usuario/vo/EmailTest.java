package com.queparche.domain.usuario.vo;

import com.queparche.domain.shared.exception.DomainValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Email VO")
class EmailTest {

    // ─── Casos válidos ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Cuando el formato es válido")
    class FormatoValido {

        @Test
        @DisplayName("acepta email estándar y lo almacena tal cual")
        void emailEstandarAceptado() {
            Email email = new Email("usuario@ejemplo.com");
            assertEquals("usuario@ejemplo.com", email.getValor());
        }

        @ParameterizedTest(name = "[{index}] acepta: {0}")
        @ValueSource(strings = {
                "usuario@ejemplo.com",
                "user.name+tag@domain.co.uk",
                "u@sub.dominio.org",
                "123@numeros.io",
                "primer.apellido@empresa.com.co"
        })
        @DisplayName("acepta múltiples formatos RFC válidos")
        void aceptaFormatosValidosVariados(String valor) {
            assertDoesNotThrow(() -> new Email(valor));
        }
    }

    // ─── Normalización ────────────────────────────────────────────────────────

    @Nested
    @DisplayName("Normalización a minúsculas")
    class Normalizacion {

        @Test
        @DisplayName("convierte mayúsculas del dominio a minúsculas")
        void normalizaDominioMayusculas() {
            Email email = new Email("usuario@EJEMPLO.COM");
            assertEquals("usuario@ejemplo.com", email.getValor());
        }

        @Test
        @DisplayName("convierte mayúsculas del usuario local a minúsculas")
        void normalizaUsuarioLocalMayusculas() {
            Email email = new Email("USUARIO@ejemplo.com");
            assertEquals("usuario@ejemplo.com", email.getValor());
        }

        @Test
        @DisplayName("normaliza email completamente en mayúsculas")
        void normalizaEmailCompleto() {
            Email email = new Email("TEST.USER@DOMAIN.COM");
            assertEquals("test.user@domain.com", email.getValor());
        }

        @Test
        @DisplayName("recorta espacios al inicio y al final antes de validar")
        void recortaEspacios() {
            Email email = new Email("  usuario@ejemplo.com  ");
            assertEquals("usuario@ejemplo.com", email.getValor());
        }
    }

    // ─── Igualdad por valor ───────────────────────────────────────────────────

    @Nested
    @DisplayName("Igualdad por valor (Value Object)")
    class Igualdad {

        @Test
        @DisplayName("dos instancias con el mismo email son iguales")
        void dosInstanciasIguales() {
            Email e1 = new Email("usuario@ejemplo.com");
            Email e2 = new Email("usuario@ejemplo.com");
            assertEquals(e1, e2);
            assertEquals(e1.hashCode(), e2.hashCode());
        }

        @Test
        @DisplayName("mayúsculas y minúsculas son el mismo valor")
        void mayusculasMinusculasIguales() {
            Email e1 = new Email("USUARIO@EJEMPLO.COM");
            Email e2 = new Email("usuario@ejemplo.com");
            assertEquals(e1, e2);
        }

        @Test
        @DisplayName("emails diferentes no son iguales")
        void emailsDiferentesNoIguales() {
            Email e1 = new Email("a@ejemplo.com");
            Email e2 = new Email("b@ejemplo.com");
            assertNotEquals(e1, e2);
        }

        @Test
        @DisplayName("toString devuelve el valor normalizado")
        void toStringDevuelveValorNormalizado() {
            Email email = new Email("USER@EXAMPLE.COM");
            assertEquals("user@example.com", email.toString());
        }
    }

    // ─── Rechazos por nulo / vacío ────────────────────────────────────────────

    @Nested
    @DisplayName("Rechaza nulo y vacío")
    class RechazoNuloVacio {

        @Test
        @DisplayName("rechaza null con excepción de dominio")
        void rechazaNull() {
            DomainValidationException ex = assertThrows(
                    DomainValidationException.class,
                    () -> new Email(null)
            );
            assertTrue(ex.getMessage().contains("email"));
        }

        @Test
        @DisplayName("rechaza cadena vacía")
        void rechazaVacio() {
            assertThrows(DomainValidationException.class, () -> new Email(""));
        }

        @Test
        @DisplayName("rechaza cadena de solo espacios")
        void rechazaSoloEspacios() {
            assertThrows(DomainValidationException.class, () -> new Email("   "));
        }
    }

    // ─── Rechazos por formato inválido ────────────────────────────────────────

    @Nested
    @DisplayName("Rechaza formatos inválidos")
    class RechazoFormatoInvalido {

        @ParameterizedTest(name = "[{index}] rechaza: \"{0}\"")
        @ValueSource(strings = {
                "sinArroba",           // sin @
                "@sinusuario.com",     // local part vacío
                "usuario@",            // dominio vacío
                "usuario@sinpunto",    // sin TLD
                "usuario@.com",        // punto al inicio del dominio
                "usuario@dominio.c",   // TLD de 1 caracter (regex exige 2+)
                "usuario @dominio.com" // espacio embebido
        })
        @DisplayName("rechaza emails con formato inválido")
        void rechazaFormatoInvalido(String valor) {
            assertThrows(DomainValidationException.class, () -> new Email(valor));
        }
    }
}
