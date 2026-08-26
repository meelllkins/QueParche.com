package com.queparche.infrastructure.web.dto.request;

import java.util.Map;

public record ActualizarPerfilRequest(String telefono, String correoSecundario, Map<String, String> redesSociales) {
}
