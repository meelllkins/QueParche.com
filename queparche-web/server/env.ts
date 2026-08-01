import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Raíz del proyecto (carpeta que contiene package.json). */
export const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const ENV = {
  PORT: Number(process.env.PORT ?? 3001),
  DATABASE_URL: process.env.DATABASE_URL ?? 'file:data/queparche.db',
  DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
};
