package com.queparche.infrastructure.persistence.util;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Utilidad de hash de contraseñas usando SHA-256 (JDK puro, sin dependencias externas).
 * Para producción, reemplazar por BCrypt vía spring-security-crypto.
 */
public final class PasswordHasher {

    private PasswordHasher() {}

    public static String hash(String rawPassword) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] bytes = digest.digest(rawPassword.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 no disponible en este JVM", e);
        }
    }
}
