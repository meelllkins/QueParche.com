import { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, useMap, useMapEvents } from 'react-leaflet';
import { Loader2, MapPin, Search } from 'lucide-react';
import { api } from '../../api/cliente';
import type { ResultadoGeocodificacion } from '../../api/tipos';
import { CENTRO_MEDELLIN, crearPin } from './marcador';
import { CapaOscura } from './MapaServicios';

export interface Ubicacion {
  latitud: number;
  longitud: number;
  direccion: string;
}

interface Props {
  valor: Ubicacion | null;
  onCambio: (ubicacion: Ubicacion) => void;
}

function ClicEnMapa({ onClic }: { onClic: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onClic(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function VolarA({ posicion }: { posicion: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (posicion) map.flyTo(posicion, 16, { duration: 0.8 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posicion?.[0], posicion?.[1]]);
  return null;
}

/**
 * Selector de ubicación para el formulario de servicio:
 *  - clic en el mapa → fija el punto y autocompleta la dirección (geocodificación inversa)
 *  - búsqueda de dirección (Nominatim, sesgada a Medellín) → clic en resultado fija todo
 *  - la dirección queda editable por si el emprendedor quiere afinarla
 */
export function SelectorUbicacion({ valor, onCambio }: Props) {
  const pin = useMemo(() => crearPin('cian'), []);
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState<ResultadoGeocodificacion[]>([]);
  const [buscando, setBuscando] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(temporizador.current);
    const texto = busqueda.trim();
    if (texto.length < 3) {
      setResultados([]);
      return;
    }
    temporizador.current = setTimeout(async () => {
      setBuscando(true);
      try {
        const encontrados = await api.get<ResultadoGeocodificacion[]>(
          `/api/geocodificar?q=${encodeURIComponent(texto)}`,
        );
        setResultados(encontrados);
      } catch {
        setResultados([]);
      } finally {
        setBuscando(false);
      }
    }, 450);
    return () => clearTimeout(temporizador.current);
  }, [busqueda]);

  const fijarPunto = async (latitud: number, longitud: number) => {
    // Fijamos el punto de una vez y completamos la dirección en segundo plano.
    onCambio({ latitud, longitud, direccion: valor?.direccion ?? '' });
    try {
      const { direccion } = await api.get<{ direccion: string }>(
        `/api/geocodificar/inversa?lat=${latitud}&lon=${longitud}`,
      );
      if (direccion) onCambio({ latitud, longitud, direccion });
    } catch {
      /* la dirección se puede escribir a mano */
    }
  };

  const elegirResultado = (r: ResultadoGeocodificacion) => {
    onCambio({ latitud: r.latitud, longitud: r.longitud, direccion: r.nombre });
    setResultados([]);
    setBusqueda('');
  };

  const posicion: [number, number] | null = valor ? [valor.latitud, valor.longitud] : null;

  return (
    <div className="space-y-3">
      {/* Búsqueda de dirección */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-texto-suave" size={16} />
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Busca un lugar de Medellín: Pueblito Paisa, Comuna 13, Carrera 70..."
          className="w-full rounded-lg border border-borde bg-carta-alt py-2.5 pl-9 pr-9 text-sm text-texto placeholder:text-texto-suave focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cian"
        />
        {buscando && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-cian" size={16} />
        )}
        {resultados.length > 0 && (
          <ul className="absolute z-[1000] mt-1 w-full overflow-hidden rounded-lg border border-borde bg-carta shadow-2xl">
            {resultados.map((r, i) => (
              <li key={`${r.latitud}-${r.longitud}-${i}`}>
                <button
                  type="button"
                  onClick={() => elegirResultado(r)}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm text-texto transition-colors hover:bg-carta-alt"
                >
                  <MapPin size={14} className="mt-0.5 shrink-0 text-cian" />
                  <span className="line-clamp-2">{r.nombre}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mapa clicable */}
      <div className="h-[320px] overflow-hidden rounded-2xl border border-borde">
        <MapContainer center={posicion ?? CENTRO_MEDELLIN} zoom={posicion ? 16 : 13} className="h-full w-full">
          <CapaOscura />
          <ClicEnMapa onClic={fijarPunto} />
          <VolarA posicion={posicion} />
          {posicion && <Marker position={posicion} icon={pin} />}
        </MapContainer>
      </div>
      <p className="text-xs text-texto-suave">
        💡 Haz clic en el mapa para ubicar tu parche, o busca la dirección arriba. Puedes ajustar el texto de
        la dirección después.
      </p>

      {/* Dirección editable */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-texto">Dirección</label>
        <input
          type="text"
          value={valor?.direccion ?? ''}
          onChange={(e) => valor && onCambio({ ...valor, direccion: e.target.value })}
          disabled={!valor}
          placeholder="Primero elige el punto en el mapa"
          className="w-full rounded-lg border border-borde bg-carta-alt px-3 py-2.5 text-sm text-texto placeholder:text-texto-suave focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cian disabled:opacity-50"
        />
        {valor && (
          <p className="mt-1 font-acento text-xs text-texto-suave">
            {valor.latitud.toFixed(5)}, {valor.longitud.toFixed(5)}
          </p>
        )}
      </div>
    </div>
  );
}
