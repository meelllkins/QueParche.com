# WORKFLOW_RULES.md

## Reglas de Flujo de Trabajo — QueParche

---

## Regla 1 — Sincronización Obligatoria de Archivos `.md`

Tras completar **cada paso** del Orden Obligatorio de Ejecución definido en `CURRENT_PHASE.md`, se deben actualizar los siguientes archivos antes de avanzar al siguiente paso:

| Archivo              | Qué actualizar                                              |
|----------------------|-------------------------------------------------------------|
| `CURRENT_PHASE.md`   | Marcar el paso como `✅ COMPLETO` con fecha y validación    |
| `PROJECT_STATE.md`   | Reflejar nuevos DTOs, contratos o estructuras añadidas      |
| `DECISIONS_LOG.md`   | Registrar cualquier decisión nueva con su código `[DXXX]`   |
| `ARCHITECTURE.md`    | Actualizar estructura de paquetes o reglas si corresponde   |

> **Esta sincronización no es opcional.** Los archivos `.md` son la fuente de verdad del estado del proyecto. Un paso "completo" sin actualización de `.md` se considera incompleto.

---

## Regla 2 — Parada Inmediata ante Fallas

Ante cualquiera de las siguientes condiciones, se detiene todo trabajo y se diagnostica antes de continuar:

| Condición                          | Acción requerida                                          |
|------------------------------------|-----------------------------------------------------------|
| `mvn compile` con errores          | Corregir errores en el paso actual. No avanzar.           |
| `mvn test` con tests rotos         | Identificar test roto. Corregir causa raíz. No avanzar.   |
| Violación de regla en `ARCHITECTURE.md` | Revertir el cambio. Registrar en `DECISIONS_LOG.md`. |
| Commit sin `mvn compile` limpio    | Prohibido. El CI lo rechazará.                            |
| Push a rama incorrecta             | Revertir inmediatamente. Solo se permite push a `claude/hexagonal-architecture-core-eiTal`. |

---

## Regla 3 — Commits Atómicos por Paso

Cada paso del Orden Obligatorio corresponde a exactamente un commit. Prohibido agrupar múltiples pasos en un solo commit.

**Formato de mensaje de commit:**
```
feat(infrastructure): <descripción del paso> — RF<N>[, RF<N>]

- Bullet 1
- Bullet 2

https://claude.ai/code/session_<session-id>
```

---

## Regla 4 — No Dependencias No Autorizadas

Prohibido añadir dependencias Maven sin autorización explícita. Las dependencias actuales son suficientes para la Fase II. Ante necesidad de nueva dependencia:
1. Documentar en `DECISIONS_LOG.md` con código `[DXXX]`.
2. Obtener aprobación explícita.
3. Solo entonces añadir al `pom.xml` correspondiente.

---

## Regla 5 — Trazabilidad de Requisitos

Todo código producido debe referenciar el RF que implementa mediante comentario `// RF##` en el controller o servicio correspondiente. No se acepta código sin trazabilidad a un requisito funcional.

---

## Regla 6 — Revisión Pre-Push

Antes de cada `git push`, verificar:

- [ ] `mvn compile` pasa en los 3 módulos
- [ ] `mvn test` pasa en los 3 módulos
- [ ] Los archivos `.md` están sincronizados
- [ ] El commit message referencia los RFs implementados
- [ ] No hay archivos sensibles staged (`.env`, credenciales, etc.)
