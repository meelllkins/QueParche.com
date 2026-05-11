package com.queparche.domain.usuario;

import com.queparche.domain.shared.exception.DomainValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Usuario — Aggregate Root")
class UsuarioTest {

    private static final String NOMBRE_VALIDO    = "Ana Gómez";
    private static final String EMAIL_VALIDO     = "ana@queparche.com";
    private static final String PASSWORD_VALIDA  = "Segura123!";

    // ─── Factory: registrarCliente ────────────────────────────────────────────

    @Nested
    @DisplayName("registrarCliente (RF02)")
    class RegistrarCliente {

        @Test
        @DisplayName("crea un usuario con rol CLIENTE")
        void creaConRolCliente() {
            Usuario u = Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertEquals(TipoRol.CLIENTE, u.getRol());
        }

        @Test
        @DisplayName("esCliente() devuelve true")
        void esClienteTrue() {
            Usuario u = Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertTrue(u.esCliente());
        }

        @Test
        @DisplayName("esEmprendedor() devuelve false")
        void esEmprendedorFalse() {
            Usuario u = Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertFalse(u.esEmprendedor());
        }

        @Test
        @DisplayName("CLIENTE NO puede gestionar servicios — segregación de rol")
        void clienteNoPuedeGestionarServicios() {
            Usuario u = Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertFalse(u.getRol().puedeGestionarServicios(),
                    "Un CLIENTE no debe tener acceso a gestión de servicios");
        }

        @Test
        @DisplayName("genera un UUID no nulo")
        void generaUuidNoNulo() {
            Usuario u = Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertNotNull(u.getId());
        }

        @Test
        @DisplayName("dos registros distintos generan UUIDs únicos")
        void generaUuidsUnicos() {
            Usuario u1 = Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            Usuario u2 = Usuario.registrarCliente("Otro", "otro@queparche.com", PASSWORD_VALIDA);
            assertNotEquals(u1.getId(), u2.getId());
        }

        @Test
        @DisplayName("almacena el nombre recortado de espacios")
        void almacenaNombreRecortado() {
            Usuario u = Usuario.registrarCliente("  Ana Gómez  ", EMAIL_VALIDO, PASSWORD_VALIDA);
            assertEquals("Ana Gómez", u.getNombre());
        }

        @Test
        @DisplayName("almacena el email normalizado a minúsculas")
        void almacenaEmailNormalizado() {
            Usuario u = Usuario.registrarCliente(NOMBRE_VALIDO, "ANA@QUEPARCHE.COM", PASSWORD_VALIDA);
            assertEquals("ana@queparche.com", u.getEmail().getValor());
        }
    }

    // ─── Factory: registrarEmprendedor ────────────────────────────────────────

    @Nested
    @DisplayName("registrarEmprendedor (RF06)")
    class RegistrarEmprendedor {

        @Test
        @DisplayName("crea un usuario con rol EMPRENDEDOR")
        void creaConRolEmprendedor() {
            Usuario u = Usuario.registrarEmprendedor(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertEquals(TipoRol.EMPRENDEDOR, u.getRol());
        }

        @Test
        @DisplayName("esEmprendedor() devuelve true")
        void esEmprendedorTrue() {
            Usuario u = Usuario.registrarEmprendedor(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertTrue(u.esEmprendedor());
        }

        @Test
        @DisplayName("esCliente() devuelve false")
        void esClienteFalse() {
            Usuario u = Usuario.registrarEmprendedor(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertFalse(u.esCliente());
        }

        @Test
        @DisplayName("EMPRENDEDOR SÍ puede gestionar servicios — segregación de rol")
        void emprendedorPuedeGestionarServicios() {
            Usuario u = Usuario.registrarEmprendedor(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertTrue(u.getRol().puedeGestionarServicios(),
                    "Un EMPRENDEDOR debe tener acceso a gestión de servicios");
        }

        @Test
        @DisplayName("genera un UUID no nulo")
        void generaUuidNoNulo() {
            Usuario u = Usuario.registrarEmprendedor(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertNotNull(u.getId());
        }
    }

    // ─── Segregación de roles (prueba cruzada) ────────────────────────────────

    @Nested
    @DisplayName("Segregación de roles — Cliente vs Emprendedor")
    class SegregacionDeRoles {

        @Test
        @DisplayName("el rol de CLIENTE y el de EMPRENDEDOR son distintos")
        void rolesDistintos() {
            Usuario cliente      = Usuario.registrarCliente(NOMBRE_VALIDO, "cliente@q.com", PASSWORD_VALIDA);
            Usuario emprendedor  = Usuario.registrarEmprendedor(NOMBRE_VALIDO, "emprend@q.com", PASSWORD_VALIDA);
            assertNotEquals(cliente.getRol(), emprendedor.getRol());
        }

        @Test
        @DisplayName("solo el EMPRENDEDOR tiene puedeGestionarServicios en true")
        void soloEmprendedorGestionaServicios() {
            Usuario cliente     = Usuario.registrarCliente(NOMBRE_VALIDO, "cli@q.com", PASSWORD_VALIDA);
            Usuario emprendedor = Usuario.registrarEmprendedor(NOMBRE_VALIDO, "emp@q.com", PASSWORD_VALIDA);

            assertAll(
                    () -> assertFalse(cliente.getRol().puedeGestionarServicios(),
                            "CLIENTE no debe gestionar servicios"),
                    () -> assertTrue(emprendedor.getRol().puedeGestionarServicios(),
                            "EMPRENDEDOR debe gestionar servicios")
            );
        }
    }

    // ─── Validaciones RF06: propagación de DomainValidationException ──────────

    @Nested
    @DisplayName("Validaciones de campo obligatorio (RF06)")
    class ValidacionesCampos {

        @Test
        @DisplayName("rechaza nombre null")
        void rechazaNombreNull() {
            assertThrows(DomainValidationException.class,
                    () -> Usuario.registrarCliente(null, EMAIL_VALIDO, PASSWORD_VALIDA));
        }

        @Test
        @DisplayName("rechaza nombre en blanco")
        void rechazaNombreBlanco() {
            assertThrows(DomainValidationException.class,
                    () -> Usuario.registrarCliente("   ", EMAIL_VALIDO, PASSWORD_VALIDA));
        }

        @Test
        @DisplayName("rechaza email con formato inválido — propaga desde Email VO")
        void rechazaEmailInvalido() {
            assertThrows(DomainValidationException.class,
                    () -> Usuario.registrarCliente(NOMBRE_VALIDO, "no-es-un-email", PASSWORD_VALIDA));
        }

        @Test
        @DisplayName("rechaza email null — propaga desde Email VO")
        void rechazaEmailNull() {
            assertThrows(DomainValidationException.class,
                    () -> Usuario.registrarCliente(NOMBRE_VALIDO, null, PASSWORD_VALIDA));
        }

        @Test
        @DisplayName("rechaza contraseña con menos de 8 caracteres — propaga desde Contrasena VO")
        void rechazaContrasenaCorta() {
            assertThrows(DomainValidationException.class,
                    () -> Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, "corta"));
        }

        @Test
        @DisplayName("rechaza contraseña null — propaga desde Contrasena VO")
        void rechazaContrasenaNull() {
            assertThrows(DomainValidationException.class,
                    () -> Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, null));
        }

        @Test
        @DisplayName("las mismas validaciones aplican para registrarEmprendedor")
        void validacionesAplicanAEmprendedor() {
            assertAll(
                    () -> assertThrows(DomainValidationException.class,
                            () -> Usuario.registrarEmprendedor(null, EMAIL_VALIDO, PASSWORD_VALIDA)),
                    () -> assertThrows(DomainValidationException.class,
                            () -> Usuario.registrarEmprendedor(NOMBRE_VALIDO, "mal@", PASSWORD_VALIDA)),
                    () -> assertThrows(DomainValidationException.class,
                            () -> Usuario.registrarEmprendedor(NOMBRE_VALIDO, EMAIL_VALIDO, "corta"))
            );
        }
    }

    // ─── Cambio de contraseña ─────────────────────────────────────────────────

    @Nested
    @DisplayName("cambiarContrasena")
    class CambioContrasena {

        @Test
        @DisplayName("actualiza la contraseña si cumple el mínimo de 8 caracteres")
        void actualizaContrasenaValida() {
            Usuario u = Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertDoesNotThrow(() -> u.cambiarContrasena("NuevaClave99!"));
            assertEquals("NuevaClave99!", u.getContrasena().getValorCrudo());
        }

        @Test
        @DisplayName("rechaza nueva contraseña corta")
        void rechazaNuevaContrasenaCorta() {
            Usuario u = Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertThrows(DomainValidationException.class, () -> u.cambiarContrasena("corta"));
        }

        @Test
        @DisplayName("rechaza nueva contraseña null")
        void rechazaNuevaContrasenaNull() {
            Usuario u = Usuario.registrarCliente(NOMBRE_VALIDO, EMAIL_VALIDO, PASSWORD_VALIDA);
            assertThrows(DomainValidationException.class, () -> u.cambiarContrasena(null));
        }
    }
}
