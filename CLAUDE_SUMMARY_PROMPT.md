# CLAUDE_SUMMARY_PROMPT.md

## Plantilla de Reporte Diferencial — QueParche

Usar esta plantilla al final de cada sesión de trabajo o tras completar un paso del Orden Obligatorio.

---

## REPORTE DIFERENCIAL — Paso [#] : [Nombre del Paso]

**Fecha:** `YYYY-MM-DD`
**Rama:** `claude/hexagonal-architecture-core-eiTal`
**Commit:** `<hash corto>`

---

### 1. Archivos Creados / Modificados

| Archivo | Acción | RF Asociado |
|---------|--------|-------------|
| `ruta/al/archivo.java` | CREADO / MODIFICADO / ELIMINADO | RF## |

---

### 2. Verificación de Reglas Arquitectónicas

| Regla | Descripción | ¿Cumple? |
|-------|-------------|----------|
| R01 | Controllers retornan `BaseResponse<T>` | [SI/NO] |
| R02 | Sin `@Entity` en módulo domain | [SI/NO] |
| R03 | Sin DTOs de infrastructure en domain | [SI/NO] |
| R04 | Mappers presentes en infrastructure | [SI/NO] |
| R05 | `reconstituir()` solo desde adaptadores | [SI/NO] |
| R06 | Comandos viajan con UUID (no Long) | [SI/NO] |
| R07 | Sin `@Service` en queparche-application | [SI/NO] |

---

### 3. Validación de Compilación y Tests

| Comando | Resultado |
|---------|-----------|
| `mvn compile -pl queparche-domain` | [PASS / FAIL] |
| `mvn compile -pl queparche-application` | [PASS / FAIL] |
| `mvn compile -pl queparche-infrastructure` | [PASS / FAIL] |
| `mvn test -pl queparche-domain` | [PASS / FAIL — X tests] |
| `mvn test -pl queparche-application` | [PASS / FAIL — X tests] |

---

### 4. Impacto Arquitectónico

Describir si el paso actual introdujo cambios que afectan:

- **Contratos de dominio** (nuevos VOs, excepciones, puertos):
  > _Ninguno / Descripción del cambio_

- **Contratos de application** (nuevos casos de uso, comandos):
  > _Ninguno / Descripción del cambio_

- **Contratos HTTP** (nuevos endpoints, cambios en request/response):
  > _Ninguno / Descripción del cambio_

- **Esquema de base de datos** (nuevas tablas, columnas, índices):
  > _Ninguno / Descripción del cambio_

---

### 5. Decisiones Tomadas en Este Paso

Listar cualquier decisión nueva registrada en `DECISIONS_LOG.md`:

- `[DXXX]` — Descripción breve de la decisión

---

### 6. Estado del Paso

| Item | Estado |
|------|--------|
| Código implementado | ✅ / ❌ |
| `mvn compile` limpio | ✅ / ❌ |
| `mvn test` verde | ✅ / ❌ |
| Archivos `.md` sincronizados | ✅ / ❌ |
| Commit realizado | ✅ / ❌ |
| Push a rama feature | ✅ / ❌ |

---

### 7. Próximo Paso

**Paso [#+1]:** [Nombre del siguiente paso]

**Prerequisitos para comenzar:**
- [ ] Este reporte aprobado
- [ ] Todos los ✅ del paso anterior confirmados
- [ ] Sin deuda técnica pendiente del paso actual

---

## Instrucción de Uso

Al inicio de cada sesión, Claude debe leer `CURRENT_PHASE.md` para identificar el paso actual, y al finalizar debe completar esta plantilla y actualizar todos los `.md` antes del push.
