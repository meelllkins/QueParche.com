import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { etiquetaDia, horaLocal } from '../../utilidades/fechas';
import { CENTRO_MEDELLIN, crearPin } from './marcador';
import type { ServicioConEmprendedor } from '../../api/tipos';

/** Capa base oscura (CARTO Dark Matter, gratuita, sin API key). */
export function CapaOscura() {
  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
    />
  );
}

function AjustarVista({ puntos }: { puntos: [number, number][] }) {
  const map = useMap();
  const clave = JSON.stringify(puntos);
  useEffect(() => {
    if (puntos.length > 0) {
      map.fitBounds(L.latLngBounds(puntos).pad(0.2), { maxZoom: 15 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave, map]);
  return null;
}

interface Props {
  servicios: ServicioConEmprendedor[];
  altura?: string;
}

/** Mapa de exploración: cada servicio activo es un pin con popup → detalle. */
export function MapaServicios({ servicios, altura = 'h-[420px]' }: Props) {
  const pin = useMemo(() => crearPin('violeta'), []);
  const puntos = servicios.map((s) => [s.latitud, s.longitud] as [number, number]);

  return (
    <div className={`${altura} overflow-hidden rounded-2xl border border-borde`}>
      <MapContainer center={CENTRO_MEDELLIN} zoom={13} className="h-full w-full" scrollWheelZoom>
        <CapaOscura />
        <AjustarVista puntos={puntos} />
        {servicios.map((s) => (
          <Marker key={s.id} position={[s.latitud, s.longitud]} icon={pin}>
            <Popup>
              <div className="min-w-[180px]">
                <p className="font-semibold text-texto">{s.nombre}</p>
                <p className="mt-0.5 text-xs text-cian">
                  {etiquetaDia(s.fechaHora)} · {horaLocal(s.fechaHora)}
                </p>
                <p className="mt-0.5 text-xs text-texto-suave">por {s.emprendedor.nombre}</p>
                <Link
                  to={`/servicios/${s.id}`}
                  className="mt-2 inline-block text-xs font-semibold text-violeta hover:text-magenta"
                >
                  Ver el parche →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

/** Mapa de un solo punto (detalle de servicio / perfil). */
export function MapaPunto({
  latitud,
  longitud,
  altura = 'h-[300px]',
}: {
  latitud: number;
  longitud: number;
  altura?: string;
}) {
  const pin = useMemo(() => crearPin('cian'), []);
  return (
    <div className={`${altura} overflow-hidden rounded-2xl border border-borde`}>
      <MapContainer center={[latitud, longitud]} zoom={16} className="h-full w-full" scrollWheelZoom>
        <CapaOscura />
        <Marker position={[latitud, longitud]} icon={pin} />
      </MapContainer>
    </div>
  );
}
