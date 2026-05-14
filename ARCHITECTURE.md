# ARCHITECTURE.md

## Arquitectura Hexagonal — QueParche

---

## Capas y Dependencias

```
queparche-domain
    └── Sin dependencias externas (ni Spring, ni JPA, ni Lombok)

queparche-application
    └── Depende de: queparche-domain
    └── Sin dependencias de framework (solo Java 17 + JDK)

queparche-infrastructure
    └── Depende de: queparche-application, queparche-domain
    └── Spring Boot 3.4.1, Spring Data JPA, MySQL Connector
```

**La dirección de dependencia es siempre hacia adentro. Nunca hacia afuera.**

---

## Reglas Inviolables

### R01 — Controllers retornan exclusivamente `BaseResponse<T>`
- Prohibido retornar DTOs crudos (e.g. `UsuarioResponse`) directamente desde un `@RestController`.
- Todo response debe envolver el payload en `BaseResponse<T>`.
- El `GlobalExceptionHandler` retorna `ErrorResponse` (no `BaseResponse`).

### R02 — Prohibido el leakage de `@Entity` en el módulo `domain`
- Ninguna clase en `queparche-domain` puede tener anotaciones de JPA (`@Entity`, `@Table`, `@Column`, `@Id`, etc.).
- Ninguna clase en `queparche-domain` puede importar `javax.persistence.*` ni `jakarta.persistence.*`.
- Violación detectada = build roto inmediato.

### R03 — Prohibido el leakage de DTOs de infrastructure en `domain`
- Ninguna clase en `queparche-domain` puede importar clases de `queparche-infrastructure`.
- Los DTOs de request/response solo existen en `infrastructure`.
- El dominio no conoce la capa HTTP.

### R04 — Mappers obligatorios en infraestructura
- Toda transformación entre entidad de dominio y JPA entity se realiza en un Mapper ubicado en `infrastructure.persistence.mapper`.
- Toda transformación entre entidad de dominio y DTO HTTP se realiza en un WebMapper ubicado en `infrastructure.web.mapper`.
- Prohibido acceder a setters de JPA entity desde fuera del Mapper correspondiente.

### R05 — `reconstituir()` exclusivo para carga desde DB
- Los métodos estáticos `reconstituir()` en entidades de dominio solo pueden ser invocados desde adaptadores de repositorio.
- Prohibido invocar `reconstituir()` desde Controllers, Services de aplicación, o Tests de comportamiento.

### R06 — Comandos viajan con UUID, no con Long
- Ningún `*Command` puede contener un campo de tipo `Long` para identificar entidades.
- Los IDs Long de base de datos son un detalle de persistencia; nunca salen de la capa de infrastructure.

### R07 — Sin anotaciones Spring en `queparche-application`
- Las clases de servicio de aplicación (e.g. `RegistrarUsuarioService`) no tienen `@Service`, `@Component`, ni ninguna anotación de Spring.
- El wiring se realiza exclusivamente en `BeanConfiguration` dentro de `infrastructure.config`.

---

## Estructura de Paquetes (infrastructure)

```
com.queparche.infrastructure
├── config/
│   └── BeanConfiguration.java
├── persistence/
│   ├── adapter/
│   │   ├── UsuarioRepositoryAdapter.java
│   │   └── ServicioRepositoryAdapter.java
│   ├── entity/
│   │   ├── UsuarioJpaEntity.java
│   │   ├── UsuarioRedJpaEntity.java
│   │   ├── ServicioJpaEntity.java
│   │   └── AuditoriaJpaEntity.java
│   ├── mapper/
│   │   ├── UsuarioMapper.java
│   │   └── ServicioMapper.java
│   ├── repository/
│   │   ├── UsuarioJpaRepository.java
│   │   ├── ServicioJpaRepository.java
│   │   └── AuditoriaJpaRepository.java
│   └── util/
│       └── PasswordHasher.java
└── web/
    ├── controller/
    │   ├── UsuarioController.java
    │   └── ServicioController.java
    ├── dto/
    │   ├── request/
    │   └── response/
    ├── exception/
    │   └── GlobalExceptionHandler.java
    └── mapper/
        └── (WebMappers — pendientes)
```

---

## Estrategia de IDs

| Contexto              | Tipo   | Motivo                                    |
|-----------------------|--------|-------------------------------------------|
| Dominio / Comandos    | UUID   | Independencia del motor de persistencia   |
| Base de datos (PK)    | Long   | AUTO_INCREMENT — rendimiento en JOINs     |
| API REST (path/body)  | UUID   | Exposición segura; no predecible          |
