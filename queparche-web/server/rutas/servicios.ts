import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { and, asc, eq, gte, or, sql, type SQL } from 'drizzle-orm';
import { db } from '../db/client';
import { servicios, usuarios } from '../db/schema';
import { esquemaServicio } from '../dominio/validacion';
import { accesoDenegado, noEncontrado } from '../dominio/errores';
import { requerirEmprendedor } from '../middleware/actor';
import { manejar } from './util';

export const rutasServicios = Router();

/**
 * GET /api/servicios
 * Filtros: ?q=texto  ?proximos=1|0 (default 1)  ?emprendedorId=uuid
 * El corazón de "visibilizar": el original no tenía ni un endpoint de lectura.
 */
rutasServicios.get(
  '/',
  manejar(async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim().toLowerCase() : '';
    const soloProximos = req.query.proximos !== '0';
    const emprendedorId = typeof req.query.emprendedorId === 'string' ? req.query.emprendedorId : '';

    const filtros: SQL[] = [];
    if (soloProximos) filtros.push(gte(servicios.fechaHora, new Date().toISOString()));
    if (emprendedorId) filtros.push(eq(servicios.emprendedorId, emprendedorId));
    if (q) {
      const patron = `%${q}%`;
      filtros.push(
        or(
          sql`lower(${servicios.nombre}) LIKE ${patron}`,
          sql`lower(${servicios.descripcion}) LIKE ${patron}`,
          sql`lower(${usuarios.nombre}) LIKE ${patron}`,
          sql`lower(coalesce(${usuarios.especialidad}, '')) LIKE ${patron}`,
        )!,
      );
    }

    const filas = await db
      .select({
        servicio: servicios,
        emprendedor: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          especialidad: usuarios.especialidad,
        },
      })
      .from(servicios)
      .innerJoin(usuarios, eq(servicios.emprendedorId, usuarios.id))
      .where(filtros.length > 0 ? and(...filtros) : undefined)
      .orderBy(asc(servicios.fechaHora));

    res.json(filas.map((f) => ({ ...f.servicio, emprendedor: f.emprendedor })));
  }),
);

/** GET /api/servicios/:id — detalle con el emprendedor completo (contacto público + redes). */
rutasServicios.get(
  '/:id',
  manejar(async (req, res) => {
    const [fila] = await db
      .select({
        servicio: servicios,
        emprendedor: {
          id: usuarios.id,
          nombre: usuarios.nombre,
          especialidad: usuarios.especialidad,
          descripcion: usuarios.descripcion,
          telefono: usuarios.telefono,
          correoSecundario: usuarios.correoSecundario,
          redesSociales: usuarios.redesSociales,
        },
      })
      .from(servicios)
      .innerJoin(usuarios, eq(servicios.emprendedorId, usuarios.id))
      .where(eq(servicios.id, req.params.id))
      .limit(1);

    if (!fila) throw noEncontrado('No encontramos ese servicio');
    res.json({ ...fila.servicio, emprendedor: fila.emprendedor });
  }),
);

/**
 * POST /api/servicios — publicar (solo EMPRENDEDOR).
 * El emprendedorId se deriva del actor, NUNCA del cuerpo de la petición
 * (corrige el fallo del original, donde el cliente enviaba el ID a su antojo).
 */
rutasServicios.post(
  '/',
  manejar(async (req, res) => {
    const actor = await requerirEmprendedor(req);
    const datos = esquemaServicio.parse(req.body);

    const nuevo = {
      id: randomUUID(),
      ...datos,
      emprendedorId: actor.id,
      createdAt: new Date().toISOString(),
    };
    await db.insert(servicios).values(nuevo);
    res.status(201).json(nuevo);
  }),
);

/** PUT /api/servicios/:id — editar. Solo el dueño. */
rutasServicios.put(
  '/:id',
  manejar(async (req, res) => {
    const actor = await requerirEmprendedor(req);
    const [existente] = await db.select().from(servicios).where(eq(servicios.id, req.params.id)).limit(1);
    if (!existente) throw noEncontrado('No encontramos ese servicio');
    if (existente.emprendedorId !== actor.id) {
      throw accesoDenegado('Solo puedes editar tus propios servicios');
    }

    const datos = esquemaServicio.parse(req.body);
    await db.update(servicios).set(datos).where(eq(servicios.id, existente.id));
    res.json({ ...existente, ...datos });
  }),
);

/** DELETE /api/servicios/:id — eliminar. Solo el dueño. */
rutasServicios.delete(
  '/:id',
  manejar(async (req, res) => {
    const actor = await requerirEmprendedor(req);
    const [existente] = await db.select().from(servicios).where(eq(servicios.id, req.params.id)).limit(1);
    if (!existente) throw noEncontrado('No encontramos ese servicio');
    if (existente.emprendedorId !== actor.id) {
      throw accesoDenegado('Solo puedes eliminar tus propios servicios');
    }

    await db.delete(servicios).where(eq(servicios.id, existente.id));
    res.status(204).end();
  }),
);
