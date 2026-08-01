# 🔥 QueParche

**Plataforma para visibilizar la gastronomía callejera de Medellín.**

Los **emprendedores** (vendedores de comida callejera) publican sus **parches** — un puesto o evento
con nombre, descripción, fecha/hora y ubicación real en la ciudad. Los **clientes** los descubren en
un mapa oscuro de Medellín y en tarjetas con toda la información: qué venden, dónde, cuándo, y cómo
contactar al emprendedor.

Reconstrucción completa del proyecto original (Java/Spring, arquitectura hexagonal), conservando su
modelo de dominio y sus reglas de negocio, con un stack moderno y liviano.

---

## Stack elegido y por qué

| Capa | Tecnología | Por qué |
|---|---|---|
| Frontend | **React 18 + Vite + TypeScript** | Estándar moderno, build instantáneo, tipado real (el build ejecuta `tsc`). |
| Estilos | **Tailwind CSS 4** | Tema "Medellín Nocturna" como design tokens (`@theme`). |
| Mapas | **Leaflet + tiles oscuros de CARTO** | Gratis y **sin API keys**: la app funciona recién clonada. |
| Geocodificación | **Nominatim (OpenStreetMap)** | Gratis, sin cuenta. El backend hace de proxy para cumplir su política de uso. |
| API | **Express + Zod** | Servidor liviano; Zod implementa las reglas del dominio con mensajes en español. |
| Base de datos | **SQLite vía libSQL + Drizzle ORM** | Ver justificación abajo. |

**¿Por qué SQLite/libSQL y no Supabase?** El requisito clave era que la base de datos *"venga lista
sin crear tablas a mano"* y que el proyecto quede listo con `npm install` + un comando. Supabase
exige crear una cuenta, un proyecto y pegar credenciales antes del primer arranque. Con libSQL la
base de datos es un archivo local que **se crea, migra y puebla sola** en el primer `npm run dev` —
cero fricción. Y para producción, el **mismo cliente** apunta a [Turso](https://turso.tech) (libSQL
gestionado, plan gratuito) cambiando una variable de entorno: se conserva la simpleza local y la
opción de nube gratis. El esquema está **versionado con migraciones** (Drizzle Kit, carpeta
[`drizzle/`](drizzle/)) que se aplican automáticamente al arrancar.

---

## Cómo instalarlo y arrancarlo

Requisitos: **Node.js 18.18+** (probado con Node 22). Nada más — ni base de datos externa, ni API keys.

```bash
cd queparche-web
npm install
npm run dev
```

Eso es todo. `npm run dev` levanta la API (puerto 3001) y el frontend (puerto 5173) a la vez.
En el primer arranque, el servidor **aplica las migraciones y puebla la base de datos solo**:
8 emprendedores y 15 servicios en ubicaciones reales de Medellín, con fechas futuras.

Abre **http://localhost:5173**.

### Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo: API + frontend con recarga en caliente. |
| `npm run build` | Build de producción (typecheck con `tsc` + bundle de Vite en `dist/`). |
| `npm start` | Producción: un solo servidor sirve la API **y** el frontend compilado en el puerto 3001. |
| `npm run seed` | **Re-siembra** la base de datos (borra todo y vuelve a poblar con fechas futuras frescas). |
| `npm run db:generate` | Genera una nueva migración tras cambiar `server/db/schema.ts`. |
| `npm run typecheck` | Solo el chequeo de tipos. |

> 💡 Si dejas el proyecto quieto unas semanas, los servicios sembrados quedan en el pasado y la vista
> "Próximos" se ve vacía. Ejecuta `npm run seed` y vuelven a la vida con fechas futuras.

### Variables de entorno

La app arranca sin configurar nada (todos los valores tienen default). Para personalizar, copia
[`.env.example`](.env.example) como `.env`:

```
PORT=3001                          # puerto del servidor
DATABASE_URL=file:data/queparche.db  # BD local (default), o libsql://... para Turso
DATABASE_AUTH_TOKEN=               # solo para Turso
```

---

## Qué hay construido

### Cara del cliente (explorar)
- **`/` Explorar** — mapa oscuro de Medellín con cada parche como pin (popup con enlace al detalle),
  tarjetas de servicios, búsqueda por texto (nombre, descripción, emprendedor, especialidad) y
  filtro Próximos/Todos.
- **`/servicios/:id` Detalle** — información completa, mapa del punto exacto, y tarjeta del
  emprendedor con teléfono, correo de contacto y redes sociales.
- **`/emprendedores` Directorio** — todos los emprendedores con conteo de parches y próxima fecha.
- **`/emprendedores/:id` Perfil** — bio, especialidad, contacto, redes, y todos sus parches
  (los pasados, colapsados y atenuados).

### Cara del emprendedor (gestionar)
- **Selector de perfil** en la barra superior (sustituto deliberado del login en esta versión).
- **`/panel`** — sus servicios con **ver / editar / eliminar** (con confirmación).
- **`/panel/nuevo` y `/panel/:id/editar`** — formulario donde la ubicación se elige **haciendo clic
  en el mapa** o **buscando una dirección** (Nominatim, sesgado a Medellín); la dirección se
  autocompleta por geocodificación inversa y queda editable.
- **`/panel/perfil`** — nombre, especialidad, bio, teléfono, correo de contacto y redes sociales.

### Reglas de negocio (heredadas del original, aplicadas en el servidor)
- Email válido y normalizado a minúsculas; único (índice de BD).
- La fecha/hora de un servicio debe ser **estrictamente futura** al crearlo o editarlo.
- Coordenadas válidas: latitud [-90, 90], longitud [-180, 180]; dirección no vacía.
- Redes sociales **solo** de: facebook, instagram, twitter/x, linkedin, tiktok, youtube.
- **Solo un EMPRENDEDOR publica servicios**, y solo el dueño puede editar/eliminar los suyos.
  El `emprendedorId` de un servicio **lo asigna el servidor a partir del actor**, nunca lo envía el
  cliente.

### API

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/servicios?q=&proximos=&emprendedorId=` | Listado con filtros, emprendedor embebido |
| GET | `/api/servicios/:id` | Detalle con emprendedor completo |
| POST | `/api/servicios` | Crear (requiere actor EMPRENDEDOR) |
| PUT | `/api/servicios/:id` | Editar (solo el dueño) |
| DELETE | `/api/servicios/:id` | Eliminar (solo el dueño) |
| GET | `/api/emprendedores` | Directorio con conteos |
| GET | `/api/emprendedores/:id` | Perfil público + servicios |
| GET | `/api/usuarios/yo` | Datos del actor (formulario de perfil) |
| PUT | `/api/usuarios/:id/perfil` | Actualizar el propio perfil |
| GET | `/api/geocodificar?q=` | Búsqueda de direcciones (proxy Nominatim) |
| GET | `/api/geocodificar/inversa?lat=&lon=` | Dirección de un punto |

Errores siempre en JSON: `{ "error": "CODIGO", "message": "...", "detalles": [...] }` con códigos
HTTP correctos (400 validación, 401 sin actor, 403 sin permiso, 404 no existe).

**El "actor"**: las rutas de escritura identifican al usuario por el header `X-Usuario-Id`
([`server/middleware/actor.ts`](server/middleware/actor.ts)). Ese módulo es la **costura para la
autenticación real**: cuando exista login, se reemplaza la lectura del header por la sesión/JWT y
ninguna ruta cambia.

---

## Cómo desplegarlo (gratis)

La app de producción es **un solo proceso Node** (`npm start`) que sirve API + frontend.

### Opción A — Render / Railway / Fly.io + Turso (recomendada)
1. Crea la BD en [Turso](https://turso.tech) (plan gratuito):
   ```bash
   turso db create queparche
   turso db show queparche --url      # → DATABASE_URL
   turso db tokens create queparche   # → DATABASE_AUTH_TOKEN
   ```
2. Crea un servicio web en [Render](https://render.com) (u otro) apuntando al repo:
   - **Build command:** `npm install && npm run build`
   - **Start command:** `npm start`
   - **Variables:** `DATABASE_URL` y `DATABASE_AUTH_TOKEN` de Turso.
3. Al primer arranque el servidor migra y siembra solo. Listo.

### Opción B — VPS o máquina propia
`npm install && npm run build && npm start` con la BD en archivo (`file:data/queparche.db`).
Solo asegúrate de que `data/` persista entre despliegues.

---

## Estructura del proyecto

```
queparche-web/
├── server/                  # API Express
│   ├── index.ts             #   arranque: migra → siembra si está vacía → escucha
│   ├── app.ts               #   rutas + estáticos (prod) + manejador de errores
│   ├── dominio/             #   reglas de negocio (Zod) y errores tipados
│   ├── middleware/actor.ts  #   identidad del actor (costura para auth real)
│   ├── rutas/               #   servicios, emprendedores, usuarios, geocodificación
│   └── db/                  #   esquema Drizzle, cliente libSQL, seed
├── drizzle/                 # migraciones SQL versionadas (generadas por drizzle-kit)
├── src/                     # frontend React
│   ├── paginas/             #   Explorar, Detalle, Directorio, Perfil, Panel, Formularios
│   ├── componentes/         #   Navbar, tarjetas, estados, mapa/ (Leaflet + selector)
│   ├── contexto/            #   ActorContext (selector de perfil)
│   ├── api/                 #   cliente HTTP + tipos espejo de la API
│   └── estilos/             #   tema "Medellín Nocturna" (Tailwind 4 @theme)
└── data/                    # BD SQLite local (ignorada por git, se crea sola)
```

## Decisiones y diferencias con el original

- **Se conservó**: el modelo Usuario/Servicio con UUID, roles CLIENTE/EMPRENDEDOR, las 5 reglas de
  negocio, la paleta "Medellín Nocturna" (violeta `#B026FF`, magenta `#FF006E`, cian `#00F5FF`) y
  las tipografías (Montserrat / Space Grotesk / Inter).
- **Se corrigió**: ahora hay lectura (el original no tenía ni un GET), la ubicación se elige en el
  mapa, no se pide ningún dato que luego se descarte, `.gitignore` correcto, configuración por
  `.env`, y `npm run build` **pasa de verdad**.
- **Se simplificó**: un solo ID (UUID) en vez de la dualidad Long/UUID — en SQLite la PK
  autoincremental separada no aporta; menos mapeo, cero fugas.
- **Se añadió** a Usuario: `especialidad` y `descripcion` (opcionales) para que el perfil público
  tenga contenido real que mostrar. Todo dato que piden los formularios se guarda y se usa.
- **Sin autenticación a propósito**: el selector de perfil simula la sesión. El diseño del backend
  (módulo `actor.ts` + `emprendedorId` derivado del actor) deja el enchufe listo para JWT/sesiones.

## Próximos pasos sugeridos

1. **Autenticación real** (la costura ya existe): registro con contraseña + bcrypt, sesión o JWT,
   y el selector de perfil desaparece.
2. **Tests**: unitarios de `server/dominio/validacion.ts` (Vitest) y de integración de rutas
   (supertest) — el dominio es funciones puras, fácil de cubrir.
3. **Fotos de los parches** (subida de imágenes) — es lo que más vida visual añadiría.
4. Rol CLIENTE activo: favoritos, "voy a ir", reseñas.
5. Notificaciones o calendario (ICS) para no perderse un parche.
6. PWA para usarla desde el celular caminando por la ciudad.
