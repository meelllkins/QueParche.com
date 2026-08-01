import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, UtensilsCrossed } from 'lucide-react';
import { api, ErrorApi } from '../api/cliente';
import type { EmprendedorDirectorio } from '../api/tipos';
import { Cargando, EstadoError, EstadoVacio } from '../componentes/Estados';
import { etiquetaDia, horaLocal } from '../utilidades/fechas';

/** Iniciales para el "avatar" con degradado. */
function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

/** Directorio de emprendedores. */
export function Emprendedores() {
  const [lista, setLista] = useState<EmprendedorDirectorio[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<EmprendedorDirectorio[]>('/api/emprendedores')
      .then(setLista)
      .catch((e) => setError(e instanceof ErrorApi ? e.message : 'No pudimos cargar los emprendedores'));
  }, []);

  if (error) return <EstadoError mensaje={error} />;
  if (!lista) return <Cargando mensaje="Buscando emprendedores..." />;

  return (
    <div className="space-y-8">
      <header className="space-y-2 pt-4 text-center">
        <h1 className="font-titulo text-3xl font-black md:text-4xl">
          Los <span className="texto-degradado">duros</span> de la calle
        </h1>
        <p className="mx-auto max-w-xl text-texto-suave">
          Conoce a quienes hacen la magia: los emprendedores de la gastronomía callejera de Medellín.
        </p>
      </header>

      {lista.length === 0 ? (
        <EstadoVacio titulo="Todavía no hay emprendedores registrados" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((e) => (
            <Link
              key={e.id}
              to={`/emprendedores/${e.id}`}
              className="group flex flex-col gap-4 rounded-2xl border border-borde bg-carta p-6 transition-all hover:-translate-y-0.5 hover:border-cian/60"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full barra-degradado font-titulo text-lg font-extrabold text-white">
                  {iniciales(e.nombre)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate font-titulo text-lg font-bold text-texto transition-colors group-hover:text-cian">
                    {e.nombre}
                  </h3>
                  {e.especialidad && <p className="truncate text-sm text-cian">{e.especialidad}</p>}
                </div>
              </div>
              {e.descripcion && <p className="line-clamp-2 text-sm text-texto-suave">{e.descripcion}</p>}
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-borde pt-3 text-xs text-texto-suave">
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed size={12} className="text-violeta" />
                  {e.totalServicios} {e.totalServicios === 1 ? 'parche' : 'parches'}
                </span>
                {e.proximaFecha && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays size={12} className="text-magenta" />
                    Próximo: {etiquetaDia(e.proximaFecha)} · {horaLocal(e.proximaFecha)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
