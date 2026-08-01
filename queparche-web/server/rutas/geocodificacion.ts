import { Router } from 'express';
import { manejar } from './util';

export const rutasGeocodificacion = Router();

/**
 * Proxy a Nominatim (OpenStreetMap) para búsqueda de direcciones.
 * Se hace del lado del servidor para cumplir su política de uso
 * (User-Agent identificable) y evitar CORS. Sin API keys.
 */
const NOMINATIM = 'https://nominatim.openstreetmap.org';
const CABECERAS = {
  'User-Agent': 'QueParche/1.0 (proyecto educativo; Medellin, Colombia)',
  'Accept-Language': 'es',
};

// Caja que encierra el Valle de Aburrá: lon_izq, lat_arriba, lon_der, lat_abajo
const VIEWBOX = '-75.75,6.40,-75.40,6.05';

/** GET /api/geocodificar?q=texto — busca direcciones/lugares dentro de Medellín. */
rutasGeocodificacion.get(
  '/',
  manejar(async (req, res) => {
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (q.length < 3) {
      res.json([]);
      return;
    }

    const buscar = async (limitarAlValle: boolean) => {
      const url = new URL(`${NOMINATIM}/search`);
      url.searchParams.set('q', q);
      url.searchParams.set('format', 'jsonv2');
      url.searchParams.set('limit', '6');
      url.searchParams.set('countrycodes', 'co');
      url.searchParams.set('viewbox', VIEWBOX);
      // bounded=1 restringe al Valle de Aburrá; sin él, el viewbox solo sesga.
      if (limitarAlValle) url.searchParams.set('bounded', '1');
      const respuesta = await fetch(url, { headers: CABECERAS });
      if (!respuesta.ok) return null;
      return (await respuesta.json()) as Array<{ display_name: string; lat: string; lon: string }>;
    };

    // Primero estricto dentro de Medellín; si no hay nada, reintento con sesgo.
    let datos = await buscar(true);
    if (datos !== null && datos.length === 0) {
      datos = await buscar(false);
    }
    if (datos === null) {
      res.status(502).json({ error: 'GEOCODIFICACION', message: 'El servicio de mapas no respondió' });
      return;
    }
    res.json(
      datos.map((d) => ({
        nombre: d.display_name,
        latitud: Number(d.lat),
        longitud: Number(d.lon),
      })),
    );
  }),
);

/** GET /api/geocodificar/inversa?lat=&lon= — dirección aproximada de un punto (clic en el mapa). */
rutasGeocodificacion.get(
  '/inversa',
  manejar(async (req, res) => {
    const lat = Number(req.query.lat);
    const lon = Number(req.query.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      res.status(400).json({ error: 'PETICION_INVALIDA', message: 'Coordenadas inválidas' });
      return;
    }
    const url = new URL(`${NOMINATIM}/reverse`);
    url.searchParams.set('lat', String(lat));
    url.searchParams.set('lon', String(lon));
    url.searchParams.set('format', 'jsonv2');

    const respuesta = await fetch(url, { headers: CABECERAS });
    if (!respuesta.ok) {
      res.status(502).json({ error: 'GEOCODIFICACION', message: 'El servicio de mapas no respondió' });
      return;
    }
    const datos = (await respuesta.json()) as { display_name?: string };
    res.json({ direccion: datos.display_name ?? '' });
  }),
);
