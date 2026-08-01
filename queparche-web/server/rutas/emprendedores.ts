import { Router } from 'express';
import { and, asc, eq, sql } from 'drizzle-orm';
import { db } from '../db/client';
import { servicios, usuarios } from '../db/schema';
import { noEncontrado } from '../dominio/errores';
import { manejar } from './util';

export const rutasEmprendedores = Router();

/** Proyección pública de un emprendedor (sin email de acceso). */
const publico = {
  id: usuarios.id,
  nombre: usuarios.nombre,
  especialidad: usuarios.especialidad,
  descripcion: usuarios.descripcion,
  telefono: usuarios.telefono,
  correoSecundario: usuarios.correoSecundario,
  redesSociales: usuarios.redesSociales,
};

/** GET /api/emprendedores — directorio con conteo de servicios y próxima fecha. */
rutasEmprendedores.get(
  '/',
  manejar(async (_req, res) => {
    const ahora = new Date().toISOString();
    const filas = await db
      .select({
        ...publico,
        // Nota: la columna externa va calificada a mano ("usuarios"."id"); si se
        // interpola con drizzle queda sin calificar y SQLite la resuelve contra
        // el `id` de la subconsulta (servicios), rompiendo la correlación.
        totalServicios: sql<number>`(select count(*) from servicios s where s.emprendedor_id = "usuarios"."id")`,
        proximaFecha: sql<string | null>`(select min(s.fecha_hora) from servicios s where s.emprendedor_id = "usuarios"."id" and s.fecha_hora >= ${ahora})`,
      })
      .from(usuarios)
      .where(eq(usuarios.rol, 'EMPRENDEDOR'))
      .orderBy(asc(usuarios.nombre));
    res.json(filas);
  }),
);

/** GET /api/emprendedores/:id — perfil público + todos sus servicios. */
rutasEmprendedores.get(
  '/:id',
  manejar(async (req, res) => {
    const [emprendedor] = await db
      .select(publico)
      .from(usuarios)
      .where(and(eq(usuarios.id, req.params.id), eq(usuarios.rol, 'EMPRENDEDOR')))
      .limit(1);
    if (!emprendedor) throw noEncontrado('No encontramos ese emprendedor');

    const susServicios = await db
      .select()
      .from(servicios)
      .where(eq(servicios.emprendedorId, emprendedor.id))
      .orderBy(asc(servicios.fechaHora));

    res.json({ ...emprendedor, servicios: susServicios });
  }),
);
