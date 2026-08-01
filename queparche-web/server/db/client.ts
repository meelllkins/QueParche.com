import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { ENV, RAIZ } from '../env';
import * as schema from './schema';

// Con base de datos en archivo, garantizamos que el directorio exista.
if (ENV.DATABASE_URL.startsWith('file:')) {
  const rutaArchivo = path.resolve(RAIZ, ENV.DATABASE_URL.slice('file:'.length));
  fs.mkdirSync(path.dirname(rutaArchivo), { recursive: true });
}

const cliente = createClient({
  url: ENV.DATABASE_URL.startsWith('file:')
    ? // libsql en Windows necesita la ruta absoluta normalizada
      'file:' + path.resolve(RAIZ, ENV.DATABASE_URL.slice('file:'.length)).replaceAll('\\', '/')
    : ENV.DATABASE_URL,
  authToken: ENV.DATABASE_AUTH_TOKEN,
});

export const db = drizzle(cliente, { schema });
