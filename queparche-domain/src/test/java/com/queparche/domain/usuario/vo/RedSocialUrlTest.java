package com.queparche.domain.usuario.vo;

import com.queparche.domain.shared.exception.DomainValidationException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("RedSocialUrl VO (RF07)")
class RedSocialUrlTest {

    // ─── Dominios permitidos ──────────────────────────────────────────────────

    @Nested
    @DisplayName("Acepta URLs de dominios permitidos")
    class DominiosPermitidos {

        @ParameterizedTest(name = "[{index}] acepta: {0}")
        @ValueSource(strings = {
                "https://www.facebook.com/queparche",
                "https://facebook.com/pagina",
                "https://www.instagram.com/queparche",
                "https://instagram.com/usuario",
                "https://www.twitter.com/handle",
                "https://twitter.com/handle",
                "https://x.com/handle",
                "https://www.x.com/handle",
                "https://www.linkedin.com/in/usuario",
                "https://linkedin.com/company/queparche",
                "https://www.tiktok.com/@usuario",
                "https://tiktok.com/@queparche",
                "https://www.youtube.com/channel/UC123",
                "https://youtube.com/@queparche",
                "http://instagram.com/usuario"
        })
        @DisplayName("acepta URLs válidas de plataformas permitidas")
        void aceptaUrlsPermitidas(String url) {
            assertDoesNotThrow(() -> new RedSocialUrl(url));
        }

        @Test
        @DisplayName("getValor retorna la URL sin espacios sobrantes")
        void getValorRetornaUrlLimpia() {
            RedSocialUrl url = new RedSocialUrl("  https://instagram.com/test  ");
            assertEquals("https://instagram.com/test", url.getValor());
        }

        @Test
        @DisplayName("toString retorna el valor de la URL")
        void toStringRetornaValor() {
            RedSocialUrl url = new RedSocialUrl("https://facebook.com/queparche");
            assertEquals("https://facebook.com/queparche", url.toString());
        }
    }

    // ─── Dominios no permitidos ───────────────────────────────────────────────

    @Nested
    @DisplayName("Rechaza dominios no permitidos")
    class DominiosNoPermitidos {

        @ParameterizedTest(name = "[{index}] rechaza: {0}")
        @ValueSource(strings = {
                "https://www.snapchat.com/add/usuario",
                "https://pinterest.com/board",
                "https://reddit.com/r/colombia",
                "https://twitch.tv/streamer",
                "https://telegram.org/usuario",
                "https://whatsapp.com/channel",
                "https://malicioso.com/perfil",
                "https://facebook.com.phishing.com/fake",
                "ftp://instagram.com/usuario"
        })
        @DisplayName("rechaza URLs de plataformas no en la lista blanca")
        void rechazaDominiosNoPermitidos(String url) {
            assertThrows(DomainValidationException.class, () -> new RedSocialUrl(url));
        }
    }

    // ─── Rechazos por nulo / vacío / formato ─────────────────────────────────

    @Nested
    @DisplayName("Rechaza nulo, vacío y sin protocolo")
    class RechazoBasico {

        @Test
        @DisplayName("rechaza null")
        void rechazaNull() {
            DomainValidationException ex = assertThrows(
                    DomainValidationException.class,
                    () -> new RedSocialUrl(null)
            );
            assertTrue(ex.getMessage().contains("redSocialUrl"));
        }

        @Test
        @DisplayName("rechaza cadena vacía")
        void rechazaVacio() {
            assertThrows(DomainValidationException.class, () -> new RedSocialUrl(""));
        }

        @Test
        @DisplayName("rechaza URL sin protocolo http/https")
        void rechazaSinProtocolo() {
            assertThrows(DomainValidationException.class,
                    () -> new RedSocialUrl("instagram.com/usuario"));
        }

        @Test
        @DisplayName("rechaza URL de solo texto")
        void rechazaTextoSimple() {
            assertThrows(DomainValidationException.class,
                    () -> new RedSocialUrl("instagram"));
        }

        @Test
        @DisplayName("rechaza URL con dominio permitido pero como subdominio falso")
        void rechazaSubdominioFalso() {
            // intento de bypass: instagram.com.attacker.com
            assertThrows(DomainValidationException.class,
                    () -> new RedSocialUrl("https://instagram.com.attacker.com/user"));
        }
    }

    // ─── Igualdad por valor ───────────────────────────────────────────────────

    @Nested
    @DisplayName("Igualdad por valor (Value Object)")
    class Igualdad {

        @Test
        @DisplayName("dos instancias con la misma URL son iguales")
        void dosInstanciasIguales() {
            RedSocialUrl u1 = new RedSocialUrl("https://instagram.com/queparche");
            RedSocialUrl u2 = new RedSocialUrl("https://instagram.com/queparche");
            assertEquals(u1, u2);
            assertEquals(u1.hashCode(), u2.hashCode());
        }

        @Test
        @DisplayName("URLs distintas no son iguales")
        void urlsDistintasNoIguales() {
            RedSocialUrl u1 = new RedSocialUrl("https://instagram.com/uno");
            RedSocialUrl u2 = new RedSocialUrl("https://facebook.com/dos");
            assertNotEquals(u1, u2);
        }
    }
}
