# ESTADO ACTUAL — QueParche.com

> Informe de auditoría del repositorio. Todo lo aquí descrito se verificó leyendo el código fuente,
> no la documentación del propio proyecto. Cuando el código y los `.md` de gobernanza se contradicen,
> se señala explícitamente.
>
> - **Fecha del análisis:** 2026-07-31
> - **Rama analizada:** `claude/hexagonal-architecture-core-eiTal`
> - **Último commit:** `1b399d6` "Many lines."
> - **Árbol de trabajo:** limpio

---

## 1. Resumen general

**Qué es.** QueParche es una plataforma web para visibilizar la gastronomía callejera de Medellín.
Conecta dos tipos de usuario: **emprendedores** (vendedores de comida callejera) que publican
**servicios** (un evento/puesto con nombre, descripción, fecha-hora y ubicación geográfica), y
**clientes** que —en el diseño previsto— los consumen.

**Alcance declarado.** El proyecto no intenta cubrir un producto completo. Según
[CLAUDE_CONTEXT.md](CLAUDE_CONTEXT.md) se implementan solo 5 requisitos funcionales seleccionados:
RF02 (registro simple), RF03 (contacto), RF06 (registro completo de emprendedor), RF07 (footer /
redes sociales) y RF10 (publicación de servicio). Tiene toda la apariencia de un proyecto académico
o de portafolio con fuerte énfasis en la disciplina arquitectónica.

**En qué punto está.** No es un esqueleto ni es un producto funcional. Es una **rebanada vertical
funcional pero mínima**:

| Capa | Estado real |
|---|---|
| Dominio (Java puro) | **Completo y sólido** para las 2 entidades que existen. 129 métodos de prueba. |
| Aplicación (casos de uso) | **3 casos de uso implementados** de verdad, con pruebas unitarias con Mockito. |
| Infraestructura (Spring/JPA/REST) | **4 endpoints operativos** de punta a punta. Cero pruebas. |
| Base de datos | Esquema SQL escrito, **debe crearse a mano**. Sin migraciones automáticas. |
| Frontend (React) | 5 pantallas maquetadas; **3 conectadas** al backend, **2 estáticas**. |
| Autenticación | **No existe**. Ni login, ni sesiones, ni tokens. |
| Despliegue / CI | **No existe**. Sin Docker, sin GitHub Actions, sin wrapper de Maven. |

**Veredicto en una frase:** el backend hace realmente lo que dice hacer para 4 operaciones de
escritura, pero no hay una sola operación de lectura en toda la API, no hay autenticación, y el
frontend es una galería de mockups navegable más que una aplicación.

---

## 2. Stack y arquitectura

### 2.1 Backend

| Elemento | Versión | Fuente |
|---|---|---|
| Java | 17 (`maven.compiler.release=17`) | [pom.xml](pom.xml) |
| Spring Boot | 3.4.1 (vía BOM, sin *parent*) | [pom.xml](pom.xml) |
| Spring Web MVC | gestionado por el BOM | [queparche-infrastructure/pom.xml](queparche-infrastructure/pom.xml) |
| Spring Data JPA / Hibernate | gestionado por el BOM | idem |
| MySQL Connector/J | gestionado por el BOM (`runtime`) | idem |
| Lombok | 1.18.36 (`optional`, **solo en infrastructure**) | idem |
| JUnit 5 + Mockito | gestionado por el BOM (`test`) | domain / application |
| Maven | multi-módulo, **sin wrapper** (`mvnw` no existe) | — |

Detalle relevante del build: el padre **no hereda** de `spring-boot-starter-parent`; importa el BOM
como `<scope>import</scope>`. Es una decisión deliberada ([D001](DECISIONS_LOG.md)) para que el
módulo de dominio no arrastre nada de Spring. Lombok está aislado como *annotation processor*
únicamente en `queparche-infrastructure` (commits `d94a15d`, `063458e`), tras una serie de fallos
`TypeTag::UNKNOWN` en JDK 17+/21 sobre Windows.

### 2.2 Frontend

| Elemento | Versión | Fuente |
|---|---|---|
| React | 18.3.1 | [queparche-frontend/package.json](queparche-frontend/package.json) |
| TypeScript | 5.7.2 | idem |
| Vite | 6.3.5 (puerto 5173) | [vite.config.ts](queparche-frontend/vite.config.ts) |
| Tailwind CSS | 4.1.12 (plugin `@tailwindcss/vite`) | package.json |
| lucide-react | 0.487.0 (iconos) | package.json |

**No hay** router, ni gestor de estado, ni cliente HTTP (usa `fetch` nativo), ni librería de
formularios, ni framework de pruebas.

### 2.3 ¿Sigue realmente Arquitectura Hexagonal?

**Sí, de forma genuina y verificable** — no es una etiqueta puesta encima de un proyecto en capas.
Comprobaciones hechas sobre el código, no sobre los `.md`:

| Regla | Verificación | Resultado |
|---|---|---|
| El dominio no conoce frameworks | `queparche-domain/pom.xml` solo declara `junit-jupiter` en scope `test`. Ningún `import` de Spring, JPA, Jakarta o Lombok en los 11 ficheros del módulo. | ✅ Cumple |
| La aplicación no conoce frameworks | `queparche-application/pom.xml` depende solo de `queparche-domain` + JUnit/Mockito. Ninguna anotación `@Service`/`@Component`. Usa `java.util.logging` para no depender de SLF4J. | ✅ Cumple |
| Dirección de dependencias hacia adentro | `infrastructure → application → domain`. Nunca al revés. | ✅ Cumple |
| Puertos de salida definidos por el dominio | [`UsuarioRepositoryPort`](queparche-domain/src/main/java/com/queparche/domain/usuario/port/out/UsuarioRepositoryPort.java) y [`ServicioRepositoryPort`](queparche-domain/src/main/java/com/queparche/domain/servicio/port/out/ServicioRepositoryPort.java) viven en `domain`; sus adaptadores JPA en `infrastructure`. | ✅ Cumple |
| Wiring manual, sin magia | [`BeanConfiguration`](queparche-infrastructure/src/main/java/com/queparche/infrastructure/config/BeanConfiguration.java) instancia los servicios de aplicación con `new`. | ✅ Cumple |
| Mappers en la frontera | Persistencia: `UsuarioMapper`, `ServicioMapper`. Web: `UsuarioWebMapper`, `ServicioWebMapper`. | ✅ Cumple |

Dos matices honestos, ninguno grave:

1. **Los puertos de entrada (`port.in`) viven en `application`, los de salida (`port.out`) en
   `domain`.** Es una variante legítima y común, pero es una asimetría: la mitad del "hexágono"
   está definida en un módulo y la otra mitad en otro.
2. **Los casos de uso devuelven entidades de dominio al controller.** `CrearServicioUseCase.crear()`
   retorna `Servicio`, no un DTO de aplicación. El `WebMapper` traduce antes de serializar, así que
   el dominio nunca llega al JSON, pero el controller sí manipula objetos de dominio.

### 2.4 Organización de carpetas

```
QueParche.com/
├── pom.xml                          ← padre agregador (packaging: pom)
│
├── queparche-domain/                ← Java 17 puro, sin dependencias
│   └── com/queparche/domain/
│       ├── usuario/
│       │   ├── Usuario.java             (aggregate root)
│       │   ├── TipoRol.java             (enum)
│       │   ├── vo/                      Email, Contrasena, RedSocialUrl
│       │   └── port/out/                UsuarioRepositoryPort
│       ├── servicio/
│       │   ├── Servicio.java            (aggregate root)
│       │   ├── vo/                      Ubicacion
│       │   ├── exception/               FechaServicioInvalidaException
│       │   └── port/out/                ServicioRepositoryPort
│       └── shared/exception/            DomainValidationException
│
├── queparche-application/           ← casos de uso, sin Spring
│   └── com/queparche/application/
│       ├── usuario/                     RegistrarUsuarioService, ActualizarPerfilService,
│       │   │                            UsuarioCommand, ActualizarPerfilCommand
│       │   └── port/in/                 RegistrarUsuarioUseCase, ActualizarPerfilUseCase
│       ├── servicio/                    CrearServicioService, ServicioCommand
│       │   └── port/in/                 CrearServicioUseCase
│       └── shared/exception/            AccesoDenegado, EmailYaRegistrado, UsuarioNoEncontrado
│
├── queparche-infrastructure/        ← único módulo con framework
│   └── com/queparche/infrastructure/
│       ├── QueParchemApplication.java   (@SpringBootApplication — nótese el typo "Parchem")
│       ├── config/                      BeanConfiguration, WebMvcConfig (CORS)
│       ├── persistence/
│       │   ├── entity/                  4 @Entity
│       │   ├── repository/              3 JpaRepository
│       │   ├── adapter/                 2 adaptadores que implementan los puertos
│       │   ├── mapper/                  dominio ⇄ JPA
│       │   └── util/                    PasswordHasher
│       └── web/
│           ├── controller/              UsuarioController, ServicioController
│           ├── dto/request|response/    4 requests, 4 responses
│           ├── mapper/                  dominio → DTO HTTP
│           └── exception/               GlobalExceptionHandler
│
└── queparche-frontend/              ← React + Vite (NO es módulo Maven)
    └── src/
        ├── main.tsx, app/App.tsx
        ├── app/components/              Logo + 5 pantallas RFxx
        ├── services/api.ts              cliente HTTP
        ├── types/api.ts                 contratos TS espejo del backend
        └── styles/                      index → fonts + tailwind + theme
```

El frontend **no está integrado al build de Maven**: no se empaqueta dentro del JAR, no hay plugin
`frontend-maven-plugin`. Son dos aplicaciones que se levantan por separado y se comunican por CORS.

---

## 3. Modelo de datos

### 3.1 Entidades de dominio

#### `Usuario` — Aggregate Root
[queparche-domain/.../usuario/Usuario.java](queparche-domain/src/main/java/com/queparche/domain/usuario/Usuario.java)

| Atributo | Tipo | Mutable | Obligatorio | Notas |
|---|---|---|---|---|
| `id` | `UUID` | no (`final`) | sí | Generado con `UUID.randomUUID()` en la fábrica |
| `email` | `Email` (VO) | no (`final`) | sí | Normalizado a minúsculas y `trim` |
| `contrasena` | `Contrasena` (VO) | sí | sí | Mínimo 8 caracteres; el hash es responsabilidad de infraestructura |
| `nombre` | `String` | sí | sí | No vacío, se aplica `trim` |
| `rol` | `TipoRol` (enum) | no (`final`) | sí | `CLIENTE` \| `EMPRENDEDOR`. Inmutable tras el registro |
| `telefono` | `String` | sí | **no** | RF03. `null` si viene vacío. **Sin validación de formato** |
| `correoSecundario` | `String` | sí | **no** | RF03. Validado con el VO `Email` si viene informado |
| `redesSociales` | `Map<String,String>` | sí | **no** | RF03/RF07. Clave = plataforma, valor = URL validada por `RedSocialUrl` |

Constructor privado. Dos fábricas públicas: `registrarCliente(...)` y `registrarEmprendedor(...)`.
Más `reconstituir(...)`, que **salta todas las validaciones** y está reservado a los adaptadores de
persistencia ([D002](DECISIONS_LOG.md)).

#### `Servicio` — Aggregate Root
[queparche-domain/.../servicio/Servicio.java](queparche-domain/src/main/java/com/queparche/domain/servicio/Servicio.java)

| Atributo | Tipo | Mutable | Obligatorio | Notas |
|---|---|---|---|---|
| `id` | `UUID` | no (`final`) | sí | Generado en `crear()` |
| `nombre` | `String` | sí* | sí | No vacío, `trim` |
| `descripcion` | `String` | sí* | sí | No vacía, `trim` |
| `fechaHora` | `LocalDateTime` | sí* | sí | **Invariante: estrictamente futura** |
| `ubicacion` | `Ubicacion` (VO) | sí* | sí | Ver abajo |
| `emprendedorId` | `UUID` | no (`final`) | sí | Referencia por ID, no por objeto |

\* Declarados no-`final`, pero **no existe ningún setter ni método mutador**. En la práctica son
inmutables.

#### `TipoRol` — enum
`CLIENTE` \| `EMPRENDEDOR`, con el método de negocio `puedeGestionarServicios()` que devuelve `true`
solo para `EMPRENDEDOR`. Curiosamente **ese método nunca se invoca**: `CrearServicioService` usa
`usuario.esEmprendedor()` en su lugar.

#### Value Objects

| VO | Reglas que impone |
|---|---|
| `Email` | No nulo/vacío. Normaliza (`trim` + `toLowerCase`). Regex RFC 5322 simplificado: dominio con punto y TLD de 2+ letras. |
| `Contrasena` | No nula/vacía. Mínimo 8 caracteres. **`toString()` omitido a propósito** para que no se filtre en logs. Guarda el valor en crudo; el hash es de infraestructura. |
| `RedSocialUrl` | Lista blanca de dominios: facebook, instagram, twitter, x, linkedin, tiktok, youtube. Acepta `http`/`https`, `www.` opcional y path opcional. |
| `Ubicacion` | Latitud en [-90, 90], longitud en [-180, 180], dirección no vacía. `equals`/`hashCode` por valor. |

### 3.2 Relaciones

```
Usuario (1) ──────< (N) Servicio
   │   por emprendedorId : UUID  — sin referencia de objeto en el dominio
   │   en BD: servicios.emprendedor_id BIGINT → usuarios.id
   │
   └───< (N) Redes sociales
       en dominio: Map<plataforma, url> dentro de Usuario
       en BD: tabla usuario_redes con FK ON DELETE CASCADE

auditoria_operaciones ── sin relación FK; guarda usuario_uuid como texto suelto
```

En el dominio, `Servicio` **no** contiene un objeto `Usuario`, solo su `UUID`. Es coherente con la
regla de agregados de DDD (una transacción, un agregado) y evita cargas perezosas transversales.

### 3.3 Esquema de base de datos

**Motor: MySQL** (8.x implícito). Confirmado por: dependencia `com.mysql:mysql-connector-j`,
`driver-class-name: com.mysql.cj.jdbc.Driver`, URL `jdbc:mysql://localhost:3306/queparche`, y el uso
de `AUTO_INCREMENT` y `ENUM(...)` en el DDL.

**No hay herramienta de migraciones.** Ni Flyway ni Liquibase. `spring.jpa.hibernate.ddl-auto: none`,
así que Hibernate **no crea nada**. El fichero
[db/schema.sql](queparche-infrastructure/src/main/resources/db/schema.sql) lleva la nota
*"Ejecutar manualmente antes de arrancar la aplicación"* — y así es: hay que ejecutarlo a mano.
Tampoco existe un `data.sql` de datos de ejemplo ni una base H2 para pruebas.

| Tabla | Columnas |
|---|---|
| `usuarios` | `id` BIGINT AI PK · `uuid` VARCHAR(36) NOT NULL UNIQUE · `nombre` VARCHAR(100) NOT NULL · `email` VARCHAR(150) NOT NULL UNIQUE · `password_hash` VARCHAR(255) NOT NULL · `rol` ENUM('CLIENTE','EMPRENDEDOR') NOT NULL · `telefono` VARCHAR(20) · `correo_secundario` VARCHAR(150) · `created_at` TIMESTAMP |
| `usuario_redes` | `id` BIGINT AI PK · `usuario_id` BIGINT NOT NULL → FK `usuarios(id)` ON DELETE CASCADE · `plataforma` VARCHAR(50) NOT NULL · `url_perfil` VARCHAR(255) NOT NULL |
| `servicios` | `id` BIGINT AI PK · `uuid` VARCHAR(36) NOT NULL UNIQUE · `emprendedor_id` BIGINT NOT NULL → FK `usuarios(id)` · `nombre` VARCHAR(100) NOT NULL · `descripcion` TEXT · `fecha_hora` DATETIME NOT NULL · `latitud` DOUBLE NOT NULL · `longitud` DOUBLE NOT NULL · `direccion` VARCHAR(255) NOT NULL · `created_at` TIMESTAMP |
| `auditoria_operaciones` | `id` BIGINT AI PK · `usuario_uuid` VARCHAR(36) NOT NULL · `accion` VARCHAR(100) NOT NULL · `fecha_registro` TIMESTAMP · `detalles` TEXT |

**Estrategia dual de identificadores** ([D004](DECISIONS_LOG.md)): la PK interna es `BIGINT
AUTO_INCREMENT` por rendimiento en JOINs; el `uuid` es una columna `UNIQUE` aparte y es lo único que
sale por la API. Los `Long` nunca abandonan la capa de persistencia. La regla se respeta en todo el
código revisado.

Observaciones sobre el esquema:

- `usuario_redes` **no tiene índice único sobre `(usuario_id, plataforma)`**, pero el dominio modela
  las redes como un `Map` con la plataforma de clave. La unicidad se mantiene solo porque el mapper
  hace `clear()` + repoblado completo en cada guardado. La BD por sí sola permitiría duplicados.
- `descripcion` es `TEXT` (sin límite práctico) mientras el `ServicioJpaEntity` no impone longitud;
  el frontend tampoco limita. No hay tope de tamaño en ninguna capa.
- `auditoria_operaciones.usuario_uuid` no tiene FK ni índice. Consultarla por usuario será un
  *full scan*.
- Ninguna tabla tiene `updated_at`, ni borrado lógico, ni versión para bloqueo optimista.

---

## 4. API REST

**Base URL:** `http://localhost:8080/api/v1`
**CORS:** habilitado en [`WebMvcConfig`](queparche-infrastructure/src/main/java/com/queparche/infrastructure/config/WebMvcConfig.java)
para `http://localhost:3000` y `http://localhost:5173`, métodos GET/POST/PUT/DELETE/OPTIONS.

Existen exactamente **4 endpoints**. Los cuatro están **implementados de verdad**, de extremo a
extremo (controller → caso de uso → dominio → adaptador JPA → MySQL). **No hay ni un solo stub, ni
un método vacío, ni un `TODO` en todo el código Java** — se buscó explícitamente `TODO`, `FIXME`,
`XXX`, `HACK` y no hay ninguna coincidencia.

| # | Método | Ruta | Qué hace | Estado |
|---|---|---|---|---|
| 1 | `POST` | `/api/v1/usuarios/clientes` | RF02 — Registra un usuario con rol `CLIENTE`. Valida email y contraseña en el dominio, comprueba unicidad de email, hashea, persiste y registra auditoría. → `201 CREATED` | ✅ Implementado. **Ningún consumidor: el frontend nunca lo llama.** |
| 2 | `POST` | `/api/v1/usuarios/emprendedores` | RF06 — Idéntico al anterior pero con rol `EMPRENDEDOR`. → `201 CREATED` | ✅ Implementado y usado por RF02 y RF06 del frontend |
| 3 | `PUT` | `/api/v1/usuarios/{uuid}/perfil` | RF03/RF07 — Actualiza teléfono, correo secundario y mapa de redes sociales. Valida cada URL contra la lista blanca. → `200 OK` | ✅ Implementado y usado por RF06 |
| 4 | `POST` | `/api/v1/servicios` | RF10 — Crea un servicio. Comprueba que el `emprendedorId` exista y tenga rol `EMPRENDEDOR`, valida coordenadas y que la fecha sea futura. → `201 CREATED` | ✅ Implementado y usado por RF10 |

### Lo que NO existe en la API

Esto es tan relevante como lo que sí existe:

- **Cero endpoints `GET`.** No se puede consultar ningún dato por HTTP. No hay listado de servicios,
  ni detalle de servicio, ni perfil de usuario. Una aplicación cuyo propósito es *visibilizar*
  emprendedores no tiene forma de mostrar ninguno.
- **Cero endpoints `DELETE` o de actualización de servicio.**
- **No hay login, logout, ni refresco de token.** No hay `spring-boot-starter-security` en el
  `pom.xml`.
- **No hay endpoint para el formulario de contacto** (RF03), pese a que la pantalla existe.

Los puertos `UsuarioRepositoryPort.buscarPorEmail()`, `ServicioRepositoryPort.buscarPorId()` y
`ServicioRepositoryPort.buscarPorEmprendedorId()` **están implementados en los adaptadores JPA pero
ningún caso de uso los invoca**. Es infraestructura de lectura ya construida esperando los casos de
uso y endpoints que nunca se escribieron.

### Contratos

**Éxito** — `BaseResponse<T>`, uniforme en los 4 endpoints (regla R01):
```json
{ "timestamp": "2026-05-22T10:30:00Z", "status": 201, "message": "Cliente registrado exitosamente", "data": { } }
```

**Error** — `ErrorResponse`, producido por
[`GlobalExceptionHandler`](queparche-infrastructure/src/main/java/com/queparche/infrastructure/web/exception/GlobalExceptionHandler.java):
```json
{ "timestamp": "...", "status": 400, "error": "VALIDACION_DOMINIO", "message": "...", "path": "/api/v1/usuarios/clientes" }
```

| Excepción | HTTP | Código `error` |
|---|---|---|
| `DomainValidationException` | 400 | `VALIDACION_DOMINIO` |
| `FechaServicioInvalidaException` | 400 | `FECHA_INVALIDA` |
| `EmailYaRegistradoException` | 409 | `EMAIL_DUPLICADO` |
| `AccesoDenegadoException` | 403 | `ACCESO_DENEGADO` |
| `UsuarioNoEncontradoException` | 404 | `USUARIO_NO_ENCONTRADO` |
| `Exception` (catch-all) | 500 | `ERROR_INTERNO` — mensaje genérico, traza al log |

El mapeo es correcto y completo respecto a las excepciones que el código puede lanzar.

**Payloads de entrada:**

| DTO | Campos |
|---|---|
| `RegistrarClienteRequest` | `nombre`, `email`, `contrasena` |
| `RegistrarEmprendedorRequest` | `nombre`, `email`, `contrasena` |
| `ActualizarPerfilRequest` | `telefono`, `correoSecundario`, `redesSociales: Map<String,String>` |
| `CrearServicioRequest` | `emprendedorId: UUID`, `nombre`, `descripcion`, `fechaHora: LocalDateTime`, `latitud: double`, `longitud: double`, `direccion` |

⚠️ Ninguno de estos DTOs usa Bean Validation. No hay un solo `@Valid`, `@NotBlank` o `@NotNull` en
el proyecto, pese a que `spring-boot-starter-validation` está declarado como dependencia. Toda la
validación ocurre en el dominio, lo cual es defendible arquitectónicamente, pero significa que un
`null` en un campo `double` primitivo o un UUID malformado producirá un **500 genérico** en vez de
un 400 descriptivo.

---

## 5. Lógica de negocio implementada

### 5.1 Reglas de dominio (siempre activas, imposibles de eludir)

Están en los constructores y fábricas, así que **no existe forma de construir un objeto inválido**:

1. **Email** — no nulo, no vacío, formato válido; se normaliza a minúsculas con `trim`. Aplicado
   tanto al email principal como al secundario.
2. **Contraseña** — no nula, no vacía, mínimo 8 caracteres. El VO omite `toString()` deliberadamente
   para que no se filtre en logs.
3. **Rol explícito** — un `Usuario` no puede existir sin rol; es `final`, no se puede cambiar
   después del registro.
4. **Fecha de servicio estrictamente futura** — invariante central de RF10. Se compara con
   `LocalDateTime.now()` en `Servicio.crear()`; lanza `FechaServicioInvalidaException`.
5. **Coordenadas geográficas válidas** — latitud [-90,90], longitud [-180,180], dirección no vacía.
6. **URLs de redes sociales en lista blanca** — solo 7 dominios permitidos. Se valida *cada* URL del
   mapa en cada actualización de perfil.

### 5.2 Reglas de aplicación (orquestación)

**Registro de usuario** — [`RegistrarUsuarioService`](queparche-application/src/main/java/com/queparche/application/usuario/RegistrarUsuarioService.java)
1. Construye el VO `Email` (valida formato).
2. Consulta unicidad con `existePorEmail()`; si existe → `EmailYaRegistradoException` → HTTP 409.
3. Bifurca a `registrarEmprendedor()` o `registrarCliente()` según `TipoRol` del comando.
4. Persiste.

**Actualización de perfil** — [`ActualizarPerfilService`](queparche-application/src/main/java/com/queparche/application/usuario/ActualizarPerfilService.java)
1. Busca por UUID; si no existe → `UsuarioNoEncontradoException` → HTTP 404.
2. Delega en `usuario.actualizarPerfil(...)`, que aplica una semántica de **reemplazo total**: si un
   campo llega `null` o vacío, se **borra** el valor anterior; si el mapa de redes llega vacío, se
   vacía la colección completa. No es un *patch* parcial.
3. Persiste.

**Creación de servicio con segregación de funciones** — [`CrearServicioService`](queparche-application/src/main/java/com/queparche/application/servicio/CrearServicioService.java)
Es el flujo con más reglas y el único con auditoría a dos niveles:
1. **Autorización:** busca el usuario por UUID. Si no existe → `AccesoDenegadoException` (403, no
   404 — decisión deliberada para no revelar qué IDs existen).
2. Si existe pero **no** es `EMPRENDEDOR` → `AccesoDenegadoException` (403). Un `CLIENTE` no puede
   publicar servicios.
3. Construye `Ubicacion` (valida coordenadas) y `Servicio` (valida fecha futura y campos).
4. Persiste.
5. Emite traza `[AUDIT-LOG] Acción: CREAR_SERVICIO | Usuario: ... | Fecha: ...` con
   `java.util.logging` (sin dependencias externas, para no contaminar la capa de aplicación).

### 5.3 Auditoría

Modelo de dos niveles ([D006](DECISIONS_LOG.md)):

- **Nivel 1 — aplicación:** log JUL en `CrearServicioService`. Solo para creación de servicio.
- **Nivel 2 — infraestructura:** fila en `auditoria_operaciones`, escrita desde los adaptadores de
  repositorio dentro de la misma transacción. Cubre **4 acciones**: `REGISTRO_CLIENTE`,
  `REGISTRO_EMPRENDEDOR`, `ACTUALIZACION_PERFIL`, `CREAR_SERVICIO`.

### 5.4 Persistencia

- **Upsert por UUID** ([D005](DECISIONS_LOG.md)): `guardar()` busca primero por UUID; si existe
  actualiza, si no inserta. El puerto es idempotente por diseño.
- **La contraseña se hashea solo al crear.** En una actualización se conserva el hash almacenado
  (`UsuarioRepositoryAdapter:41-43`), lo cual evita re-hashear un hash, pero tiene la consecuencia
  descrita en la sección 6.
- **Hashing SHA-256 sin sal**, con `MessageDigest` del JDK. El propio código lo marca: *"Para
  producción, reemplazar por BCrypt vía spring-security-crypto"*, y está registrado como deuda
  técnica consciente en [D003](DECISIONS_LOG.md).
- `@Transactional` a nivel de clase en ambos adaptadores; `open-in-view: false`.
- Al reconstituir un `Usuario` desde la BD, el hash de 64 caracteres se envuelve en un VO
  `Contrasena` — pasa la validación de longitud mínima por casualidad numérica. Está documentado en
  [D002](DECISIONS_LOG.md), pero significa que un objeto `Usuario` cargado de BD contiene un hash en
  el campo que semánticamente es "contraseña en crudo".

### 5.5 Pruebas

| Módulo | Ficheros de test | Métodos `@Test` | `@ParameterizedTest` |
|---|---|---|---|
| `queparche-domain` | 6 | 94 | 0 |
| `queparche-application` | 3 | 27 | 8 |
| `queparche-infrastructure` | **0** | **0** | **0** |
| **Total** | **9** | **121** | **8** |

Los tests que existen son de buena calidad: usan `@Nested` + `@DisplayName` para organizar por
escenario, `ArgumentCaptor` para verificar lo que se persiste, y cubren tanto el camino feliz como
los rechazos. Cubren invariantes de dominio, segregación de roles, email duplicado, fecha en el
pasado y propagación de validaciones.

Pero **la capa de infraestructura no tiene ni una sola prueba**: ni de los controllers, ni de los
mappers JPA, ni de los adaptadores, ni del `GlobalExceptionHandler`. No hay `@SpringBootTest`,
`@DataJpaTest`, `MockMvc` ni Testcontainers. Es exactamente lo que
[CURRENT_PHASE.md](CURRENT_PHASE.md) lista como pendiente de Fase III.

> Nota sobre la cifra "173/173 PASS" que aparece en `CURRENT_PHASE.md`: hay 129 métodos anotados;
> con la expansión de los 8 `@ParameterizedTest` el total de ejecuciones puede ser mayor, así que la
> cifra es plausible. En cualquier caso corresponde solo a domain + application.

---

## 6. Frontend

**Sí existe interfaz de usuario**, en [queparche-frontend/](queparche-frontend/): React 18 +
TypeScript + Vite + Tailwind 4, con un tema oscuro propio ("Medellín Nocturna": violeta `#B026FF`,
magenta `#FF006E`, cian `#00F5FF`) y tres tipografías de Google Fonts.

**Naturaleza de la aplicación:** no es un producto con flujo de usuario. `App.tsx` es un **selector
de mockups**: una pantalla de inicio con 5 tarjetas y una barra de navegación que hace `switch`
sobre un `useState`. No hay router, no hay URLs por pantalla, no hay sesión ni estado compartido
entre pantallas.

| Pantalla | Fichero | Estado real |
|---|---|---|
| **Home / selector** | `App.tsx` | ✅ Funcional. Rejilla de 5 tarjetas + nav responsive con menú hamburguesa. |
| **RF06 — Registro Completo** | [RF06-RegistroCompleto.tsx](queparche-frontend/src/app/components/RF06-RegistroCompleto.tsx) | ✅ **Conectado.** Flujo real de 2 pasos: `POST /usuarios/emprendedores` → toma el UUID → `PUT /usuarios/{uuid}/perfil`. Estados `idle/registrando/actualizando/done`, spinner por paso, pantalla de éxito, manejo de errores de la API. |
| **RF02 — Registro Simple** | [RF02-RegistroSimple.tsx](queparche-frontend/src/app/components/RF02-RegistroSimple.tsx) | ✅ **Conectado.** `POST /usuarios/emprendedores`. Mostrar/ocultar contraseña, loading, error, pantalla de éxito con ID/email/rol. |
| **RF10 — Publicar Servicio** | [RF10-InformacionServicio.tsx](queparche-frontend/src/app/components/RF10-InformacionServicio.tsx) | ✅ **Conectado.** `POST /servicios`. Combina los campos `fecha` + `hora` en un ISO `LocalDateTime`. Pantalla de éxito con los datos devueltos. |
| **RF03 — Contacto** | [RF03-Contacto.tsx](queparche-frontend/src/app/components/RF03-Contacto.tsx) | ⚠️ **Puramente estática.** Sin `useState`, sin `onSubmit`, sin llamada a la API. Los inputs no son controlados. Pulsar "Enviar" recarga la página. Los datos de contacto son *placeholders* literales: `(000) 000-0000`, `correo@ejemplo.com`, `Lorem Ipsum 123, Ciudad, País`. |
| **RF07 — Footer** | [RF07-Footer.tsx](queparche-frontend/src/app/components/RF07-Footer.tsx) | ⚠️ **Puramente estático.** Todos los enlaces apuntan a anclas muertas (`#inicio`, `#facebook`, `#privacidad`…). Además es un *componente* de pie de página presentado como si fuera una pantalla completa. |
| **Logo** | [Logo.tsx](queparche-frontend/src/app/components/Logo.tsx) | ✅ SVG inline con degradado, dos variantes (`full`/`icon`) y tres tamaños. |

**Capa de API** ([services/api.ts](queparche-frontend/src/services/api.ts)): un `apiFetch` genérico
con `BASE_URL` **hardcodeado** a `http://localhost:8080/api/v1` (sin variables de entorno de Vite) y
4 funciones tipadas. Los tipos en [types/api.ts](queparche-frontend/src/types/api.ts) reflejan
fielmente `BaseResponse<T>`, `ErrorResponse`, `UsuarioResponse` y `ServicioResponse` del backend.

---

## 7. Qué falta / qué está roto

Ordenado por gravedad. Todo verificado en el código.

### 🔴 Bloqueantes

**1. `npm run build` está roto — falta `tsconfig.json`.**
El script es `"build": "tsc && vite build"`, pero **no existe ningún `tsconfig.json`** en
`queparche-frontend/`. Verificado ejecutando `npx tsc --noEmit`: imprime la ayuda del compilador y
sale con **código 1**, así que el `&&` nunca llega a `vite build`. Consecuencia: **el frontend no se
puede compilar para producción**. `npm run dev` sí funciona, porque Vite transpila con esbuild sin
consultar `tsconfig.json`. Corolario: el TypeScript del proyecto **nunca ha sido verificado por el
compilador**; los tipos son decorativos.

**2. No hay autenticación ni autorización real.**
El `emprendedorId` viaja **en el cuerpo de la petición**, enviado por el cliente
(`CrearServicioRequest.emprendedorId`). Cualquiera que conozca o adivine un UUID puede publicar
servicios en nombre de ese emprendedor. La comprobación de rol en `CrearServicioService` verifica
que *ese ID* sea emprendedor, pero **no verifica que quien llama sea ese usuario**. No hay login, ni
sesión, ni JWT, ni `spring-boot-starter-security`. La "segregación de funciones" que el proyecto
declara como estándar bancario es, en la práctica, una comprobación sobre un dato que el atacante
controla.

**3. La API no tiene ni un solo `GET`.**
No existe forma de leer datos por HTTP. El propósito declarado del producto —visibilizar
emprendedores y sus servicios— es literalmente imposible con la API actual. Los métodos de lectura
(`buscarPorId`, `buscarPorEmail`, `buscarPorEmprendedorId`) ya están implementados en los adaptadores
JPA, pero ningún caso de uso ni controller los usa.

**4. Falta el wrapper de Maven y Maven no está instalado.**
No existen `mvnw`, `mvnw.cmd` ni `.mvn/`. Sí existe un commit `ab6ab5f` titulado *"fijar permisos de
mvnw"*, pero `git log -- mvnw .mvn` no devuelve nada: el wrapper nunca llegó a versionarse. Además,
`mvn` no está en el `PATH` de este equipo. Sin instalar Maven a mano, **el backend no se puede
compilar ni ejecutar desde la línea de órdenes**.

### 🟠 Graves

**5. `node_modules/` está versionado en git.**
6.550 de los 6.645 ficheros del repositorio (el **98,6 %**) son dependencias de npm. Se
introdujeron en el último commit, `1b399d6` "Many lines.". El [.gitignore](.gitignore) contiene solo
reglas de Java y **no menciona `node_modules/` ni `dist/`**. Esto infla el repositorio, ensucia
irremediablemente los diffs y hace inservibles herramientas como `git log --stat`.

**6. Cero pruebas en la capa de infraestructura.**
Ningún test de controllers, mappers JPA, adaptadores ni del manejador de excepciones. Los mappers
son precisamente el punto donde más fácilmente se cuelan errores silenciosos (un campo sin mapear no
rompe la compilación). El propio `CURRENT_PHASE.md` lo reconoce como pendiente.

**7. SHA-256 sin sal para contraseñas.**
Documentado como deuda consciente ([D003](DECISIONS_LOG.md)) con el plan de migrar a BCrypt, pero
sigue ahí. Sin sal, es vulnerable a *rainbow tables*, y SHA-256 es demasiado rápido para ser un hash
de contraseñas.

**8. Cambiar la contraseña es imposible, y silenciosamente.**
`Usuario.cambiarContrasena()` existe en el dominio y está cubierto por tests, pero: no hay caso de
uso que lo llame, no hay endpoint, y —lo importante— si lo hubiera **no funcionaría**:
`UsuarioRepositoryAdapter.guardar()` conserva el hash almacenado en toda actualización
(`UsuarioRepositoryAdapter:41-43`). El cambio se perdería sin error alguno.

**9. Sin validación de entrada en la frontera HTTP.**
`spring-boot-starter-validation` está declarado en el `pom.xml` pero **no se usa en ninguna parte**:
cero `@Valid`, cero `@NotBlank`. Un JSON malformado, un UUID inválido o un `null` en un campo
`double` primitivo caen en el `catch (Exception)` y devuelven **500 con "Ocurrió un error
inesperado"** en lugar de un 400 explicativo.

### 🟡 Incoherencias y trabajo a medias

**10. El endpoint `/usuarios/clientes` no tiene ningún consumidor.**
La pantalla llamada "RF02 — Registro Simple" **registra emprendedores**, no clientes: llama a
`registrarEmprendedor()` y su título interno dice "Emprendedor". La función `registrarCliente()`
está exportada en `api.ts` y **nunca se importa en ningún sitio**. Es decir: el rol `CLIENTE` existe
en el dominio, en la BD y en la API, pero **no hay forma de crear uno desde la interfaz**.

**11. RF06 recoge tres campos que descarta en silencio.**
El formulario pide **cédula**, **nombre del negocio** y **años de experiencia**. Ninguno se envía al
backend, ninguno tiene columna en la BD, ninguno existe en el dominio. El usuario los escribe y
desaparecen sin aviso.

**12. RF10 exige pegar un UUID a mano.**
El primer campo del formulario de publicación es "ID del Emprendedor", que el usuario debe copiar de
la pantalla de registro y pegar. Es consecuencia directa de la ausencia de sesión.

**13. `GeolocalizacionPort` no existe.**
Se menciona como puerto de salida requerido en [CLAUDE_CONTEXT.md](CLAUDE_CONTEXT.md) §3 y en el
javadoc de [`Ubicacion`](queparche-domain/src/main/java/com/queparche/domain/servicio/vo/Ubicacion.java)
(*"esa responsabilidad pertenece a GeolocalizacionPort"*). No hay ningún fichero con ese nombre. Las
coordenadas se introducen a mano; no hay mapa, ni geocodificación, ni autocompletado de dirección.

**14. `TipoRol.puedeGestionarServicios()` nunca se invoca.**
El método de negocio existe y está probado, pero `CrearServicioService` usa `usuario.esEmprendedor()`
en su lugar. Lógica de autorización duplicada en dos sitios.

**15. La documentación de gobernanza se ha desincronizado del código.**
`WORKFLOW_RULES.md` declara los `.md` como "fuente de verdad", pero:

| Documento | Dice | Realidad |
|---|---|---|
| [PROJECT_STATE.md](PROJECT_STATE.md) | `RegistrarEmprendedorRequest` tiene `instagram`, `facebook`, `tiktok` | El record solo tiene `nombre`, `email`, `contrasena` |
| [ARCHITECTURE.md](ARCHITECTURE.md) | `web/mapper/ (WebMappers — pendientes)` | `UsuarioWebMapper` y `ServicioWebMapper` existen desde `cbf72b1` |
| [CURRENT_PHASE.md](CURRENT_PHASE.md) | "Fase II — Infraestructura" en el título | Fase II está cerrada; se está en Fase III |
| [CLAUDE_CONTEXT.md](CLAUDE_CONTEXT.md) | paquete `com.queparche.core.domain` | El paquete real es `com.queparche.domain` |

**16. Detalles menores confirmados en código:**
- La clase principal se llama `QueParchemApplication` — con una "m" de más.
- `ServicioRepositoryAdapter.registrarAuditoria()` escribe siempre la acción `CREAR_SERVICIO`,
  también cuando el `guardar()` fue en realidad una actualización.
- `UsuarioMapper.sincronizarRedes()` hace `clear()` y repuebla la colección con `orphanRemoval=true`
  en la misma transacción — patrón que Hibernate puede rechazar en algunos escenarios. **No
  verificado en ejecución** por falta de BD y de pruebas de integración.
- `apiFetch` en el frontend hace `await res.json()` incondicionalmente: si el backend está caído o
  responde HTML (p. ej. un 404 de Tomcat), la promesa rechaza con un `SyntaxError` y el usuario ve
  "Error inesperado. Intenta de nuevo."
- `BASE_URL` está hardcodeado; no hay `import.meta.env` ni fichero `.env`.
- Sin CI: `.github/` contiene únicamente scripts de *hooks* de la herramienta `java-upgrade` de
  Claude Code (`recordToolUse.ps1/.sh`). **No hay workflows de GitHub Actions**, pese a que
  `WORKFLOW_RULES.md` afirma que "el CI lo rechazará".
- Sin Docker, sin `docker-compose.yml`, sin perfiles de Spring (`application-dev.yml` /
  `application-prod.yml`).
- Sin pruebas de frontend de ningún tipo.
- Sin `LICENSE` referenciado desde el README (el fichero `LICENSE` existe, pero el `README.md` son 2
  líneas).

### Dependencias declaradas y no usadas

| Dependencia | Situación |
|---|---|
| `spring-boot-starter-validation` | **Nunca se usa.** Cero anotaciones de Bean Validation en el proyecto. |
| `spring-boot-starter-test` | Declarada en `infrastructure`, pero ese módulo no tiene `src/test/`. |
| `lucide-react` | Sí se usa (iconos en todas las pantallas). |

### Nota sobre el JDK

El `pom.xml` fija `<release>17</release>`, pero el único `java` en el `PATH` de este equipo es
**OpenJDK 25.0.4 (Temurin)**. Compilar con `--release 17` sobre JDK 25 es correcto y está soportado.
Aun así, conviene tenerlo presente: el historial de commits muestra tres correcciones consecutivas
por errores `TypeTag::UNKNOWN` de Lombok con JDK modernos en Windows (`4afd3db`, `063458e`,
`d94a15d`), resueltos aislando Lombok como *annotation processor* exclusivo de `infrastructure`.

---

## 8. Cómo correrlo

### Requisitos previos

| Requisito | Estado en este equipo |
|---|---|
| JDK 17 o superior | ✅ OpenJDK 25.0.4 (Temurin) |
| **Maven 3.9+** | ❌ **No instalado / no está en el `PATH`.** No hay wrapper `mvnw`. Hay que instalarlo. |
| **MySQL 8.x** en `localhost:3306` | ❓ No verificado |
| Node.js + npm | ✅ Instalados |

### Paso 1 — Base de datos (obligatorio y manual)

`ddl-auto` está en `none`: Hibernate **no crea las tablas**. Hay que hacerlo a mano.

```bash
mysql -u root -p -e "CREATE DATABASE queparche CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p queparche < queparche-infrastructure/src/main/resources/db/schema.sql
```

Configuración por defecto en [application.yml](queparche-infrastructure/src/main/resources/application.yml):
`jdbc:mysql://localhost:3306/queparche`, usuario `root`, **contraseña vacía**. Se puede sobrescribir
con las variables de entorno `DB_URL`, `DB_USER` y `DB_PASSWORD`.

### Paso 2 — Backend

```bash
# desde la raíz del repositorio
mvn clean install                                   # compila los 3 módulos y ejecuta 129 tests
mvn -pl queparche-infrastructure spring-boot:run    # arranca en http://localhost:8080
```

Alternativa con JAR (el `spring-boot-maven-plugin` con *goal* `repackage` está configurado solo en
`queparche-infrastructure`):

```bash
mvn clean package
java -jar queparche-infrastructure/target/queparche-infrastructure-1.0.0-SNAPSHOT.jar
```

Para ejecutar solo las pruebas sin BD (domain y application no la necesitan):
```bash
mvn test
```

### Paso 3 — Frontend

```bash
cd queparche-frontend
npm install        # node_modules ya está versionado, pero conviene refrescarlo
npm run dev        # http://localhost:5173
```

`npm run dev` **funciona**. `npm run build` **falla** por la ausencia de `tsconfig.json` (ver punto 1
de la sección 7). El origen `localhost:5173` ya está permitido en la configuración CORS del backend.

### Paso 4 — Probar el flujo completo

Con backend y frontend arrancados y la BD creada, el único recorrido de extremo a extremo que
funciona es:

1. Abrir `http://localhost:5173` → **RF06 — Registro Completo** → rellenar y enviar.
   Se ejecutan dos llamadas encadenadas (`POST /usuarios/emprendedores` + `PUT
   /usuarios/{uuid}/perfil`). **Copiar el UUID que muestra la pantalla de éxito.**
2. Volver al inicio → **RF10 — Publicar Servicio** → pegar ese UUID en "ID del Emprendedor",
   rellenar el resto con una **fecha futura** y coordenadas válidas (p. ej. Medellín: `6.2518`,
   `-75.5636`) → enviar.
3. Verificar en MySQL: `SELECT * FROM usuarios; SELECT * FROM servicios; SELECT * FROM auditoria_operaciones;`

Prueba directa de la API sin frontend:

```bash
curl -X POST http://localhost:8080/api/v1/usuarios/emprendedores \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Carlos Ruiz","email":"carlos@queparche.com","contrasena":"Segura123!"}'
```

No hay forma de consultar el resultado por HTTP: hay que mirar la base de datos directamente.

---

## Conclusión

Lo que está hecho, está hecho con rigor poco común: el dominio es Java puro y verificable, la
separación hexagonal es real y no decorativa, las invariantes de negocio son imposibles de eludir
porque viven en constructores y fábricas, y hay 129 pruebas bien escritas sobre las dos capas
internas.

El problema no es la calidad de lo escrito, sino su **alcance**. Sobre esa base sólida hay 4
operaciones de escritura y ninguna de lectura, ninguna autenticación, ninguna prueba de
infraestructura, y un frontend que es una galería de mockups con tres formularios conectados. Falta
además la fontanería básica de un proyecto ejecutable: wrapper de Maven, `tsconfig.json`,
migraciones de BD, CI y un `.gitignore` que ignore `node_modules/`.

Los tres arreglos de mayor impacto por esfuerzo invertido serían: **(1)** añadir `tsconfig.json` y
`node_modules/` al `.gitignore`; **(2)** exponer los endpoints `GET` sobre los métodos de repositorio
que ya existen y no se usan; **(3)** implementar login y derivar el `emprendedorId` de la sesión en
vez de aceptarlo del cliente.
