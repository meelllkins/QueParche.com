# PROJECT_STATE.md

## Estado Actual: Fase II — Capa de Infraestructura

---

## DTOs de Entrada (Request)

### `RegistrarClienteRequest`
```java
record RegistrarClienteRequest(String nombre, String email, String contrasena)
```

### `RegistrarEmprendedorRequest`
```java
record RegistrarEmprendedorRequest(
    String nombre,
    String email,
    String contrasena,
    String instagram,
    String facebook,
    String tiktok
)
```

### `ActualizarPerfilRequest`
```java
record ActualizarPerfilRequest(
    String telefono,
    String correoSecundario,
    Map<String, String> redesSociales
)
```

### `CrearServicioRequest`
```java
record CrearServicioRequest(
    UUID emprendedorId,
    String nombre,
    String descripcion,
    LocalDateTime fechaHora,
    double latitud,
    double longitud,
    String direccion
)
```

---

## Contrato de Salida Unificado

### `BaseResponse<T>`

Todos los endpoints deben retornar exclusivamente `BaseResponse<T>`. Prohibido retornar entidades de dominio, JPA entities, o DTOs crudos directamente desde un controller.

```json
{
  "timestamp": "2025-05-14T10:30:00.000Z",
  "status": 201,
  "message": "Operación exitosa",
  "data": { }
}
```

| Campo       | Tipo    | Descripción                          |
|-------------|---------|--------------------------------------|
| `timestamp` | String  | ISO-8601 UTC (e.g. `2025-05-14T10:30:00Z`) |
| `status`    | int     | Código HTTP (200, 201, 204, etc.)    |
| `message`   | String  | Descripción legible de la operación  |
| `data`      | T       | Payload tipado; `null` en 204        |

---

## Estructura de Error

### `ErrorResponse`

Retornado por el `GlobalExceptionHandler` ante cualquier excepción de dominio o de infraestructura.

```json
{
  "timestamp": "2025-05-14T10:30:00.000Z",
  "status": 400,
  "error": "VALIDACION_DOMINIO",
  "message": "El correo electrónico no tiene un formato válido",
  "path": "/api/v1/usuarios/clientes"
}
```

| Campo       | Tipo   | Descripción                          |
|-------------|--------|--------------------------------------|
| `timestamp` | String | ISO-8601 UTC                         |
| `status`    | int    | Código HTTP del error                |
| `error`     | String | Código de error interno (SCREAMING_SNAKE_CASE) |
| `message`   | String | Mensaje descriptivo del error        |
| `path`      | String | URI del endpoint que generó el error |

---

## Módulos del Proyecto

| Módulo                      | Responsabilidad                               |
|-----------------------------|-----------------------------------------------|
| `queparche-domain`          | Entidades, VOs, puertos, excepciones de dominio |
| `queparche-application`     | Casos de uso, comandos, servicios de aplicación |
| `queparche-infrastructure`  | JPA, REST, Spring, MySQL, mappers             |
