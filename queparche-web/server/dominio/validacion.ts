import { z } from 'zod';

/**
 * Reglas de negocio del dominio QueParche, heredadas del proyecto original:
 *  - Email válido, normalizado a minúsculas, único (unicidad la impone la BD).
 *  - fechaHora de un servicio estrictamente futura al crearlo/editarlo.
 *  - Coordenadas: latitud [-90, 90], longitud [-180, 180], dirección no vacía.
 *  - Redes sociales solo de la lista blanca de dominios.
 *  - Solo EMPRENDEDOR publica servicios (se aplica en las rutas, ver actor.ts).
 */

export const PLATAFORMAS_PERMITIDAS = [
  'facebook',
  'instagram',
  'twitter',
  'x',
  'linkedin',
  'tiktok',
  'youtube',
] as const;

const DOMINIOS_PERMITIDOS = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'tiktok.com',
  'youtube.com',
];

const RE_RED_SOCIAL = new RegExp(
  `^https?://(www\\.)?(${DOMINIOS_PERMITIDOS.map((d) => d.replace('.', '\\.')).join('|')})(/\\S*)?$`,
  'i',
);

export const esquemaEmail = z
  .string({ message: 'El correo es obligatorio' })
  .trim()
  .toLowerCase()
  .email('El correo no tiene un formato válido')
  .max(150, 'El correo no puede superar 150 caracteres');

export const esquemaRedes = z
  .record(
    z.string(),
    z
      .string()
      .trim()
      .regex(
        RE_RED_SOCIAL,
        'URL no permitida. Solo se aceptan enlaces de: facebook, instagram, twitter/x, linkedin, tiktok y youtube',
      ),
  )
  .refine(
    (redes) => Object.keys(redes).every((k) => (PLATAFORMAS_PERMITIDAS as readonly string[]).includes(k)),
    `Plataforma no permitida. Usa: ${PLATAFORMAS_PERMITIDAS.join(', ')}`,
  );

/** Convierte cadenas vacías o de solo espacios en null (campos opcionales de formulario). */
const opcional = <T extends z.ZodTypeAny>(esquema: T) =>
  z.preprocess((v) => (typeof v === 'string' && v.trim() === '' ? null : v), esquema.nullable().optional());

export const esquemaPerfil = z.object({
  nombre: z
    .string({ message: 'El nombre es obligatorio' })
    .trim()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  especialidad: opcional(z.string().trim().max(80, 'La especialidad no puede superar 80 caracteres')),
  descripcion: opcional(z.string().trim().max(500, 'La bio no puede superar 500 caracteres')),
  telefono: opcional(
    z
      .string()
      .trim()
      .regex(/^\+?[\d\s()-]{7,20}$/, 'El teléfono no tiene un formato válido'),
  ),
  correoSecundario: opcional(esquemaEmail),
  redesSociales: esquemaRedes.default({}),
});

export const esquemaServicio = z.object({
  nombre: z
    .string({ message: 'El nombre es obligatorio' })
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  descripcion: z
    .string({ message: 'La descripción es obligatoria' })
    .trim()
    .min(10, 'Cuéntanos un poco más: la descripción debe tener al menos 10 caracteres')
    .max(1000, 'La descripción no puede superar 1000 caracteres'),
  fechaHora: z
    .string({ message: 'La fecha y hora son obligatorias' })
    .datetime({ offset: true, message: 'La fecha no tiene un formato válido (ISO 8601)' })
    .refine((v) => new Date(v).getTime() > Date.now(), 'La fecha y hora del servicio deben ser futuras'),
  latitud: z
    .number({ message: 'Selecciona la ubicación en el mapa' })
    .min(-90, 'Latitud fuera de rango')
    .max(90, 'Latitud fuera de rango'),
  longitud: z
    .number({ message: 'Selecciona la ubicación en el mapa' })
    .min(-180, 'Longitud fuera de rango')
    .max(180, 'Longitud fuera de rango'),
  direccion: z
    .string({ message: 'La dirección es obligatoria' })
    .trim()
    .min(5, 'La dirección no puede estar vacía')
    .max(255, 'La dirección no puede superar 255 caracteres'),
});

export type DatosPerfil = z.infer<typeof esquemaPerfil>;
export type DatosServicio = z.infer<typeof esquemaServicio>;
