import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { usuarios } from '../db/schema';
import { esquemaPerfil } from '../dominio/validacion';
import { accesoDenegado } from '../dominio/errores';
import { obtenerActor } from '../middleware/actor';
import { manejar } from './util';

export const rutasUsuarios = Router();

/** GET /api/usuarios/yo — datos completos del actor (para el formulario de perfil). */
rutasUsuarios.get(
  '/yo',
  manejar(async (req, res) => {
    const actor = await obtenerActor(req);
    res.json(actor);
  }),
);

/** PUT /api/usuarios/:id/perfil — editar el propio perfil. */
rutasUsuarios.put(
  '/:id/perfil',
  manejar(async (req, res) => {
    const actor = await obtenerActor(req);
    if (actor.id !== req.params.id) {
      throw accesoDenegado('Solo puedes editar tu propio perfil');
    }

    const datos = esquemaPerfil.parse(req.body);
    const cambios = {
      nombre: datos.nombre,
      especialidad: datos.especialidad ?? null,
      descripcion: datos.descripcion ?? null,
      telefono: datos.telefono ?? null,
      correoSecundario: datos.correoSecundario ?? null,
      redesSociales: datos.redesSociales,
    };
    await db.update(usuarios).set(cambios).where(eq(usuarios.id, actor.id));
    res.json({ ...actor, ...cambios });
  }),
);
