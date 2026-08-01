import L from 'leaflet';

/**
 * Pin de mapa propio (SVG con el degradado de marca).
 * Evita el clásico problema de los iconos por defecto de Leaflet con
 * bundlers, y de paso se ve mucho mejor en el tema oscuro.
 */
export function crearPin(variante: 'violeta' | 'cian' = 'violeta'): L.DivIcon {
  const id = `pin-grad-${variante}`;
  const colores =
    variante === 'cian'
      ? ['#00F5FF', '#B026FF']
      : ['#B026FF', '#FF006E'];
  return L.divIcon({
    className: variante === 'cian' ? 'marcador-qp-cian' : 'marcador-qp',
    html: `
      <svg width="34" height="44" viewBox="0 0 34 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colores[0]}"/>
            <stop offset="100%" stop-color="${colores[1]}"/>
          </linearGradient>
        </defs>
        <path d="M17 0C7.6 0 0 7.6 0 17c0 11.8 14.2 24.9 16.1 26.6a1.3 1.3 0 0 0 1.8 0C19.8 41.9 34 28.8 34 17 34 7.6 26.4 0 17 0Z" fill="url(#${id})"/>
        <circle cx="17" cy="16.5" r="6.5" fill="#0A0A0A"/>
      </svg>`,
    iconSize: [34, 44],
    iconAnchor: [17, 43],
    popupAnchor: [0, -40],
  });
}

/** Centro por defecto: Medellín. */
export const CENTRO_MEDELLIN: [number, number] = [6.2442, -75.5812];
