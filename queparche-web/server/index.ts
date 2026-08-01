import path from 'node:path';
import { sql } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/libsql/migrator';
import { ENV, RAIZ } from './env';
import { db } from './db/client';
import { usuarios } from './db/schema';
import { sembrar } from './db/seed';
import { crearApp } from './app';

async function principal() {
  // 1. Migraciones automáticas: la BD queda lista sin crear tablas a mano.
  await migrate(db, { migrationsFolder: path.join(RAIZ, 'drizzle') });

  // 2. Primer arranque: si la BD está vacía, se puebla sola con datos de Medellín.
  const [{ n }] = await db.select({ n: sql<number>`count(*)` }).from(usuarios);
  if (Number(n) === 0) {
    await sembrar();
    console.log('🌱 Base de datos vacía → poblada con datos de ejemplo de Medellín');
  }

  // 3. Servidor
  crearApp().listen(ENV.PORT, () => {
    console.log(`🔥 API QueParche escuchando en http://localhost:${ENV.PORT}`);
    console.log('   En desarrollo, abre el frontend en http://localhost:5173 (npm run dev)');
  });
}

principal().catch((err) => {
  console.error('No fue posible arrancar el servidor:', err);
  process.exit(1);
});
