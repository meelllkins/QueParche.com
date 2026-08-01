import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { api, ErrorApi } from '../api/cliente';
import type { ServicioConEmprendedor } from '../api/tipos';
import { MapaServicios } from '../componentes/mapa/MapaServicios';
import { TarjetaServicio } from '../componentes/TarjetaServicio';
import { Cargando, EstadoError, EstadoVacio } from '../componentes/Estados';

/** Vista principal: mapa de Medellín + listado de servicios, con búsqueda y filtro. */
export function Explorar() {
  const [servicios, setServicios] = useState<ServicioConEmprendedor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [soloProximos, setSoloProximos] = useState(true);
  const temporizador = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(
      async () => {
        try {
          setError(null);
          const params = new URLSearchParams();
          if (busqueda.trim()) params.set('q', busqueda.trim());
          params.set('proximos', soloProximos ? '1' : '0');
          const lista = await api.get<ServicioConEmprendedor[]>(`/api/servicios?${params}`);
          setServicios(lista);
        } catch (e) {
          setError(e instanceof ErrorApi ? e.message : 'No pudimos cargar los servicios');
          setServicios([]);
        }
      },
      busqueda ? 350 : 0,
    );
    return () => clearTimeout(temporizador.current);
  }, [busqueda, soloProximos]);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <header className="space-y-3 pt-4 text-center">
        <h1 className="font-titulo text-4xl font-black md:text-5xl">
          ¿Qué <span className="texto-degradado">parche</span> hay hoy?
        </h1>
        <p className="mx-auto max-w-xl text-texto-suave">
          Arepas, buñuelos, chuzos, mango biche... Descubre la gastronomía callejera de Medellín, puesto por
          puesto, en el mapa de la ciudad.
        </p>
      </header>

      {/* Controles */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-texto-suave" size={17} />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Busca por antojo, nombre o emprendedor: arepa, chuzo, empanada..."
            className="w-full rounded-xl border border-borde bg-carta py-3 pl-10 pr-4 text-sm text-texto placeholder:text-texto-suave focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violeta"
          />
        </div>
        <div className="flex shrink-0 gap-1 rounded-xl border border-borde bg-carta p-1">
          <button
            onClick={() => setSoloProximos(true)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              soloProximos ? 'bg-violeta text-white' : 'text-texto-suave hover:text-texto'
            }`}
          >
            Próximos
          </button>
          <button
            onClick={() => setSoloProximos(false)}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              !soloProximos ? 'bg-violeta text-white' : 'text-texto-suave hover:text-texto'
            }`}
          >
            Todos
          </button>
        </div>
      </div>

      {error && <EstadoError mensaje={error} />}

      {servicios === null ? (
        <Cargando />
      ) : (
        <>
          {/* Mapa */}
          <MapaServicios servicios={servicios} />

          {/* Listado */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-titulo text-xl font-bold text-texto">
                {soloProximos ? 'Próximos parches' : 'Todos los parches'}
              </h2>
              <span className="font-acento text-sm text-texto-suave">
                {servicios.length} {servicios.length === 1 ? 'resultado' : 'resultados'}
              </span>
            </div>
            {servicios.length === 0 ? (
              <EstadoVacio
                titulo="No encontramos parches con esos filtros"
                detalle={
                  soloProximos
                    ? 'Prueba con otra búsqueda, o mira en "Todos" los parches pasados. Si la base de datos lleva tiempo sembrada, ejecuta `npm run seed` para refrescar las fechas.'
                    : 'Prueba con otra búsqueda.'
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {servicios.map((s) => (
                  <TarjetaServicio key={s.id} servicio={s} />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
