import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { RAIZ } from '../env';
import { db } from './client';
import { servicios, usuarios } from './schema';
import { CLIENTES, EMPRENDEDORES, fechaFutura } from './datos-semilla';

/**
 * Puebla la base de datos con emprendedores y servicios de Medellín.
 * Con `reset = true` borra todo antes de sembrar (npm run seed).
 * Las fechas son siempre futuras respecto al momento de ejecución,
 * así que re-sembrar "revive" la app si los datos envejecieron.
 */
export async function sembrar(reset = false): Promise<void> {
  if (reset) {
    await db.delete(servicios);
    await db.delete(usuarios);
  }

  const ahora = new Date().toISOString();

  for (const emprendedor of EMPRENDEDORES) {
    const usuarioId = randomUUID();
    await db.insert(usuarios).values({
      id: usuarioId,
      email: emprendedor.email,
      nombre: emprendedor.nombre,
      rol: 'EMPRENDEDOR',
      telefono: emprendedor.telefono,
      correoSecundario: emprendedor.correoSecundario ?? null,
      redesSociales: emprendedor.redesSociales,
      especialidad: emprendedor.especialidad,
      descripcion: emprendedor.descripcion,
      createdAt: ahora,
    });

    for (const servicio of emprendedor.servicios) {
      await db.insert(servicios).values({
        id: randomUUID(),
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        fechaHora: fechaFutura(servicio.dias, servicio.hora, servicio.minutos ?? 0),
        latitud: servicio.latitud,
        longitud: servicio.longitud,
        direccion: servicio.direccion,
        emprendedorId: usuarioId,
        createdAt: ahora,
      });
    }
  }

  for (const cliente of CLIENTES) {
    await db.insert(usuarios).values({
      id: randomUUID(),
      email: cliente.email,
      nombre: cliente.nombre,
      rol: 'CLIENTE',
      redesSociales: {},
      createdAt: ahora,
    });
  }
}

// Ejecutado como script directo: `npm run seed` (tsx server/db/seed.ts --reset)
const esScriptPrincipal =
  process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (esScriptPrincipal) {
  const reset = process.argv.includes('--reset');
  migrate(db, { migrationsFolder: path.join(RAIZ, 'drizzle') })
    .then(() => sembrar(reset))
    .then(() => {
      const totalServicios = EMPRENDEDORES.reduce((acc, e) => acc + e.servicios.length, 0);
      console.log(
        `🌱 Seed completado: ${EMPRENDEDORES.length} emprendedores, ${totalServicios} servicios, ${CLIENTES.length} clientes.`,
      );
      process.exit(0);
    })
    .catch((err) => {
      console.error('El seed falló:', err);
      process.exit(1);
    });
}
