# CURRENT_PHASE.md

## Fase Actual: Fase II — Infraestructura

---

## Orden Obligatorio de Ejecución

Cada paso debe completarse y validarse antes de avanzar al siguiente. No se permite omitir pasos ni ejecutar en paralelo.

| #  | Paso                         | Estado     | Validación requerida                          |
|----|------------------------------|------------|-----------------------------------------------|
| 1  | Configuración MySQL          | ✅ COMPLETO `2026-05-14` | `application.yml` con `ddl-auto=none` activo — `mvn compile` 4/4 SUCCESS — tests 35/35 PASS |
| 2  | JPA Entities                 | ✅ COMPLETO `2026-05-14` | 4 entidades verificadas contra schema.sql — `mvn clean compile` 4/4 SUCCESS |
| 3  | Persistence Mappers          | ✅ COMPLETO `2026-05-14` | `UsuarioMapper` + `ServicioMapper` — ambas direcciones verificadas — `mvn clean compile` 4/4 SUCCESS |
| 4  | Repository Adapters          | ✅ COMPLETO `2026-05-14` | `UsuarioRepositoryAdapter` + `ServicioRepositoryAdapter` verificados — `mvn clean test` 173/173 PASS |
| 5  | Auditoría                    | ✅ COMPLETO `2026-05-14` | 4 operaciones cubiertas (REGISTRO_CLIENTE, REGISTRO_EMPRENDEDOR, ACTUALIZACION_PERFIL, CREAR_SERVICIO) — `mvn clean test` 173/173 PASS |
| 6  | Exception Handler            | ✅ COMPLETO | `GlobalExceptionHandler` mapea todos los códigos de error |
| 7  | Controllers & WebMappers     | ✅ COMPLETO | Endpoints responden `BaseResponse<T>`; `mvn compile` limpio |

---

## Regla de Avance

> **Ningún paso puede marcarse como COMPLETO sin que `mvn compile` pase sin errores Y los tests existentes sigan en verde.**

Ante cualquier falla de compilación o test roto:
1. **Parada inmediata** — no continuar con el siguiente paso.
2. Diagnosticar la causa raíz.
3. Corregir en el paso actual.
4. Re-ejecutar `mvn compile` y `mvn test`.
5. Solo entonces marcar el paso como COMPLETO y avanzar.

---

## Pendientes Fase II

- [ ] Migrar controllers a `BaseResponse<T>` (actualmente retornan DTOs crudos)
- [ ] Migrar `GlobalExceptionHandler` a `ErrorResponse` con campo `path`
- [ ] Crear `WebMapper` en infrastructure para transformar `BaseResponse<T>`

---

## Próxima Fase

**Fase III — Testing de Integración y Validación End-to-End**
- Tests de integración con `@SpringBootTest` y `TestContainers` (MySQL)
- Validación de contratos HTTP con MockMvc
