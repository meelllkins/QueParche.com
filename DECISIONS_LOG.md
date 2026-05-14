# DECISIONS_LOG.md

## Registro de Decisiones Arquitectónicas — QueParche

---

## [D001] Multi-módulo Maven con dominio sin dependencias de framework
- **Fecha:** Fase I
- **Decisión:** `queparche-domain` no hereda de Spring Boot parent; usa BOM para gestión de versiones transitivas.
- **Motivo:** Garantía física de ausencia de contaminación. Si un developer intenta usar `@Entity` en domain, el compilador lo rechaza.
- **Alternativa descartada:** Módulo único con convención de paquetes.

## [D002] `reconstituir()` como factory method para carga desde DB
- **Fecha:** Fase I
- **Decisión:** Métodos estáticos `reconstituir()` en entidades de dominio que bypasean validaciones de negocio.
- **Motivo:** Los datos en DB ya pasaron por validación al escribirse; re-validarlos al leerlos es redundante y rompería la carga de hashes SHA-256 (64 chars > 8 chars mínimo de Contrasena).
- **Alternativa descartada:** Constructor package-private accesible desde mapper.

## [D003] SHA-256 via JDK `MessageDigest` para hashing de contraseñas
- **Fecha:** Fase II
- **Decisión:** Usar `java.security.MessageDigest` en lugar de BCrypt.
- **Motivo:** Evitar dependencia en `spring-security-crypto`; mantener el conteo de dependencias externas al mínimo.
- **Advertencia:** SHA-256 sin salt no es adecuado para producción. Migrar a BCrypt antes del lanzamiento.

## [D004] Estrategia dual de ID (UUID externo / Long interno)
- **Fecha:** Fase II
- **Decisión:** JPA entities usan Long AUTO_INCREMENT como PK. El UUID es un campo `UNIQUE NOT NULL` separado.
- **Motivo:** Rendimiento en JOINs con Long; opacidad y seguridad con UUID en la API.
- **Impacto:** Todos los comandos y DTOs de API usan UUID. Los Long nunca salen de la capa de persistence.

## [D005] Upsert-by-UUID en `UsuarioRepositoryAdapter`
- **Fecha:** Fase II
- **Decisión:** `guardar()` busca por UUID antes de guardar. Si existe, actualiza; si no, inserta.
- **Motivo:** El puerto `guardar()` es idempotente por diseño. Spring Data no tiene upsert nativo por campo no-PK.
- **Alternativa descartada:** Métodos separados `crear()` y `actualizar()` en el puerto.

## [D006] Auditoría en dos niveles
- **Fecha:** Fase II
- **Decisión:** Nivel 1 — JUL Logger `[AUDIT-LOG]` en `CrearServicioService` (application layer). Nivel 2 — Insert en tabla `auditoria_operaciones` en `ServicioRepositoryAdapter` (infrastructure layer).
- **Motivo:** Application layer produce trazabilidad independiente del motor de persistencia. Infrastructure layer persiste el registro de auditoría estructurado.

## [D007] Sin `@Service` en `queparche-application`
- **Fecha:** Fase II
- **Decisión:** Los servicios de aplicación son POJOs; el wiring se hace en `BeanConfiguration`.
- **Motivo:** Mantener `queparche-application` libre de dependencias de Spring; los servicios son testeables sin contexto de Spring.

## [D008] Unificación de contratos de salida con `BaseResponse<T>`
- **Fecha:** Fase II
- **Decisión:** Todos los endpoints REST retornan `BaseResponse<T>` con campos `timestamp`, `status`, `message`, y `data`. Los errores retornan `ErrorResponse` con campo adicional `path`.
- **Motivo:** Contrato uniforme facilita el consumo por parte de clientes (frontend, apps móviles, integraciones). Elimina ambigüedad sobre la forma del response según el endpoint.
- **Impacto:** Controllers deben ser refactorizados para usar `BaseResponse<T>`. `GlobalExceptionHandler` debe enriquecer `ErrorResponse` con el `path` del request.
- **Alternativa descartada:** Retornar DTOs crudos directamente (implementación actual — marcada como deuda técnica).

## [D009] Inmutabilidad de contratos de dominio y application
- **Fecha:** Fase II
- **Decisión:** Los `*Command` y los Value Objects del dominio son inmutables. Una vez creados, no se modifican.
- **Motivo:** Elimina race conditions en entornos concurrentes. Simplifica el razonamiento sobre el estado del sistema. Obliga a crear nuevas instancias en lugar de mutar estado existente.
- **Regla derivada:** Prohibido añadir setters a `*Command`. Prohibido añadir setters a Value Objects. Prohibido añadir setters a registros de dominio.
- **Excepción controlada:** JPA Entities en infrastructure pueden tener setters (requerido por Hibernate).
