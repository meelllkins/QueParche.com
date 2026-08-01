import type { Request } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/client';
import { usuarios, type UsuarioFila } from '../db/schema';
import { accesoDenegado, noAutenticado } from '../dominio/errores';

/**
 * "Actor": el usuario en cuyo nombre se ejecuta la petición.
 *
 * En esta versión sin autenticación, el frontend lo declara con el header
 * `X-Usuario-Id` (elegido en el selector de perfil). Este módulo es la
 * COSTURA para autenticación real: cuando exista login, basta reemplazar
 * la lectura del header por la sesión/JWT — las rutas no cambian.
 */
export async function obtenerActor(req: Request): Promise<UsuarioFila> {
  const id = req.header('x-usuario-id');
  if (!id) {
    throw noAutenticado('Elige primero con qué perfil estás actuando');
  }
  const [usuario] = await db.select().from(usuarios).where(eq(usuarios.id, id)).limit(1);
  if (!usuario) {
    throw noAutenticado('El perfil seleccionado ya no existe');
  }
  return usuario;
}

/** Regla de negocio: solo un usuario con rol EMPRENDEDOR gestiona servicios. */
export async function requerirEmprendedor(req: Request): Promise<UsuarioFila> {
  const actor = await obtenerActor(req);
  if (actor.rol !== 'EMPRENDEDOR') {
    throw accesoDenegado('Solo los emprendedores pueden publicar y gestionar servicios');
  }
  return actor;
}
