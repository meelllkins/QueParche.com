# Rescate de assets visuales — "Medellín Nocturna"

Carpeta **temporal**. Contiene la identidad visual salvada de la versión React
(`queparche-web/`) antes de purgarla, para reutilizarla en el frontend
HTML/CSS/JS del stack Java.

## Paleta

| Color | Hex | Uso |
|---|---|---|
| Violeta | `#B026FF` | Primario, acciones, enlaces activos |
| Magenta | `#FF006E` | Secundario, errores, urgencia ("Hoy") |
| Cian | `#00F5FF` | Acento, confirmaciones, datos |
| Fondo | `#0A0A0A` | Fondo de la app |
| Carta | `#161616` | Superficie de tarjetas |
| Carta alt | `#1F1F1F` | Inputs, superficies anidadas |
| Texto | `#F5F5F5` | Texto principal |
| Texto suave | `#9CA3AF` | Texto secundario |

Gradiente de marca: `linear-gradient(90deg, #B026FF, #FF006E, #00F5FF)`

## Tipografía (Google Fonts)

- **Montserrat** (700/800/900) — títulos
- **Inter** (400/500/600) — cuerpo
- **Space Grotesk** (500/600/700) — acento/datos

## Archivos

| Archivo | Qué es |
|---|---|
| `tema-medellin-nocturna.css` | **El que se usa.** CSS vanilla, sin build: tokens, tipografía, y componentes base (`.carta`, `.boton`, `.campo`, `.insignia`, `.texto-degradado`, `.barra-degradado`). |
| `plantilla-base.html` | Plantilla HTML con el favicon y el isotipo SVG rescatados, y una muestra de cada componente. Ábrelo en el navegador para ver el tema. |
| `referencia/theme-original-fuente.css` | **CSS fuente original** con la paleta sin compilar (variables `--queparche-violet`, etc.). Rescatado de la rama `claude/hexagonal-architecture-core-eiTal`. |
| `referencia/fonts-original-fuente.css` | Definiciones de tipografía originales. Misma procedencia. |
| `referencia/bundle-tailwind-compilado.css` | Copia cruda del bundle (39 KB). Solo referencia — es Tailwind compilado, no sirve directamente. |
| `referencia/index-original-react.html` | HTML original de la SPA React. Solo referencia. |

## Procedencia

Dos fuentes, rescatadas en este orden:

1. **`queparche-web/dist/`** (bundle compilado) — era la única copia en disco: el CSS
   fuente de esa versión ya había sido borrado y `queparche-web/` nunca estuvo
   trackeado en git. De aquí salieron los tokens, normalizados a minúsculas por
   Tailwind y restaurados aquí a mayúsculas. Se rescató **antes** de purgar `dist/`.
2. **Rama `claude/hexagonal-architecture-core-eiTal`** — al inspeccionar git se
   encontró el CSS fuente original del primer frontend, sin compilar. Es la fuente
   más fiel y confirma que la paleta rescatada del bundle es correcta.

En esa misma rama sigue el frontend React original completo
(`queparche-frontend/src/app/components/RF*.tsx`), útil como referencia de
maquetación de las pantallas RF02, RF03, RF06, RF07 y RF10 si se quieren replicar
en HTML/CSS/JS.
