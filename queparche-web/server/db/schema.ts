import { index, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Modelo de datos QueParche.
 * Diseño heredado del proyecto original (Java/hexagonal), con dos campos
 * nuevos y opcionales en Usuario (`especialidad`, `descripcion`) para que
 * el perfil público del emprendedor tenga contenido real que mostrar.
 *
 * IDs: UUID como clave primaria. En SQLite no hay ganancia real con PK
 * autoincremental separada, así que se elimina la dualidad Long/UUID
 * del original: un solo identificador, el que viaja por la API.
 */

export const usuarios = sqliteTable('usuarios', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  nombre: text('nombre').notNull(),
  rol: text('rol', { enum: ['CLIENTE', 'EMPRENDEDOR'] }).notNull(),
  telefono: text('telefono'),
  correoSecundario: text('correo_secundario'),
  /** Mapa plataforma → URL. Solo dominios de la lista blanca (validado en dominio). */
  redesSociales: text('redes_sociales', { mode: 'json' }).$type<Record<string, string>>().notNull(),
  /** Qué vende — p. ej. "Arepas de chócolo". Opcional. */
  especialidad: text('especialidad'),
  /** Bio corta del emprendedor. Opcional. */
  descripcion: text('descripcion'),
  createdAt: text('created_at').notNull(),
});

export const servicios = sqliteTable(
  'servicios',
  {
    id: text('id').primaryKey(),
    nombre: text('nombre').notNull(),
    descripcion: text('descripcion').notNull(),
    /** ISO 8601 UTC. Invariante: futura al momento de crear/editar. */
    fechaHora: text('fecha_hora').notNull(),
    latitud: real('latitud').notNull(),
    longitud: real('longitud').notNull(),
    direccion: text('direccion').notNull(),
    emprendedorId: text('emprendedor_id')
      .notNull()
      .references(() => usuarios.id, { onDelete: 'cascade' }),
    createdAt: text('created_at').notNull(),
  },
  (t) => [
    index('idx_servicios_emprendedor').on(t.emprendedorId),
    index('idx_servicios_fecha').on(t.fechaHora),
  ],
);

export type UsuarioFila = typeof usuarios.$inferSelect;
export type ServicioFila = typeof servicios.$inferSelect;
