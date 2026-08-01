import fs from 'node:fs';
import path from 'node:path';
import express, { type NextFunction, type Request, type Response } from 'express';
import { ZodError } from 'zod';
import { RAIZ } from './env';
import { ErrorApp } from './dominio/errores';
import { rutasServicios } from './rutas/servicios';
import { rutasEmprendedores } from './rutas/emprendedores';
import { rutasUsuarios } from './rutas/usuarios';
import { rutasGeocodificacion } from './rutas/geocodificacion';

export function crearApp() {
  const app = express();
  app.use(express.json());

  app.use('/api/servicios', rutasServicios);
  app.use('/api/emprendedores', rutasEmprendedores);
  app.use('/api/usuarios', rutasUsuarios);
  app.use('/api/geocodificar', rutasGeocodificacion);

  // 404 de API en JSON (nunca HTML)
  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'NO_ENCONTRADO', message: 'Ruta de API no encontrada' });
  });

  // En producción, el mismo servidor sirve el frontend compilado (dist/)
  const dist = path.join(RAIZ, 'dist');
  if (fs.existsSync(dist)) {
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  // Manejador central de errores → contrato uniforme { error, message, detalles? }
  app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
      res.status(400).json({
        error: 'VALIDACION',
        message: err.issues[0]?.message ?? 'Datos inválidos',
        detalles: err.issues.map((i) => ({ campo: i.path.join('.'), mensaje: i.message })),
      });
      return;
    }
    if (err instanceof ErrorApp) {
      res.status(err.status).json({ error: err.codigo, message: err.message });
      return;
    }
    console.error(`[ERROR] ${req.method} ${req.originalUrl}`, err);
    res.status(500).json({ error: 'ERROR_INTERNO', message: 'Ocurrió un error inesperado' });
  });

  return app;
}
