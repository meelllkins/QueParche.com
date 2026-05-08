# PROTOCOLO DE DESARROLLO - QUEPARCHE CORE (FASE I)

## 1. ESTADO DEL PROYECTO
- **Arquitectura:** Hexagonal (Puertos y Adaptadores).
- **Stack:** Java 17, Spring Boot 3.x, MySQL.
- **RF Seleccionados:** 2, 3, 6, 7 y 10.

## 2. REGLAS DE ORO DE IMPLEMENTACIÓN (ESTRICTO)
1. **Independencia del Dominio:** El paquete `com.queparche.core.domain` DEBE ser Java puro. No se permiten anotaciones de Spring, JPA o validaciones de infraestructura.
2. **Validación de Dominio (RF06):** La lógica de validación (ej. formato de email, longitud de clave) debe residir en el Dominio. Los DTOs de infraestructura pueden usar `@Valid`, pero el objeto de dominio debe ser íntegro por sí mismo.
3. **Segregación de Roles (Contexto Banco):** Aplicar el principio de acceso mínimo. Los roles (Cliente/Emprendedor) definidos en el RF02 deben dictar la visibilidad de los datos en los servicios de aplicación.
4. **Manejo de IDs:** Utilizar `UUID` para identificadores externos y `Long` autoincremental para persistencia interna si es necesario, manteniendo el mapeo en la capa de infraestructura.

## 3. ESPECIFICACIÓN DE REQUISITOS CLAVE
- **RF10 (Servicio):** La ubicación debe modelarse como un Value Object `Ubicacion(lat, lng, direccion)`. No implementar lógica de Google Maps en el dominio; definir un puerto de salida `GeolocalizacionPort`.
- **RF07 (Redes Sociales):** Implementar validación de patrones de URL (Regex) para asegurar que solo se registren dominios válidos.

## 4. PROTOCOLO DE INTERACCIÓN CON EL USUARIO
- **Mínimo Error:** No asumas tipos de datos o relaciones si no están explícitas en el PPI o el documento de la API.
- **Punto de Control:** Si encuentras ambigüedad en la lógica de negocio, DETENTE. Genera un informe detallado de la duda y espera confirmación antes de escribir una sola línea de código.
- **Prohibición de Alucinación:** No inventes funcionalidades fuera de los 5 RF especificados.