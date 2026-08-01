import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ChefHat, Mail, MapPin, Phone } from 'lucide-react';
import { api, ErrorApi } from '../api/cliente';
import type { ServicioDetalle } from '../api/tipos';
import { MapaPunto } from '../componentes/mapa/MapaServicios';
import { RedesSociales } from '../componentes/RedesSociales';
import { Cargando, EstadoError } from '../componentes/Estados';
import { esPasado, fechaLarga } from '../utilidades/fechas';

/** Detalle de un servicio: toda su información + el emprendedor + mapa. */
export function DetalleServicio() {
  const { id } = useParams<{ id: string }>();
  const [servicio, setServicio] = useState<ServicioDetalle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get<ServicioDetalle>(`/api/servicios/${id}`)
      .then(setServicio)
      .catch((e) => setError(e instanceof ErrorApi ? e.message : 'No pudimos cargar el servicio'));
  }, [id]);

  if (error) return <EstadoError mensaje={error} />;
  if (!servicio) return <Cargando mensaje="Cargando el parche..." />;

  const pasado = esPasado(servicio.fechaHora);
  const e = servicio.emprendedor;

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-texto-suave hover:text-cian">
        <ArrowLeft size={15} /> Volver a explorar
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {e.especialidad && (
            <span className="rounded-full bg-cian/10 px-3 py-1 text-xs font-semibold text-cian">
              {e.especialidad}
            </span>
          )}
          {pasado && (
            <span className="rounded-full bg-carta-alt px-3 py-1 text-xs font-semibold text-texto-suave">
              Este parche ya pasó
            </span>
          )}
        </div>
        <h1 className="font-titulo text-3xl font-black text-texto md:text-4xl">{servicio.nombre}</h1>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna principal */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-borde bg-carta p-6">
            <p className="leading-relaxed text-texto">{servicio.descripcion}</p>
            <div className="mt-5 space-y-3 border-t border-borde pt-5">
              <p className="flex items-center gap-2.5 text-sm">
                <CalendarDays size={17} className="shrink-0 text-magenta" />
                <span className={pasado ? 'text-texto-suave line-through' : 'font-semibold text-texto'}>
                  {fechaLarga(servicio.fechaHora)}
                </span>
              </p>
              <p className="flex items-center gap-2.5 text-sm text-texto">
                <MapPin size={17} className="shrink-0 text-cian" />
                {servicio.direccion}
              </p>
            </div>
          </div>

          <MapaPunto latitud={servicio.latitud} longitud={servicio.longitud} altura="h-[340px]" />
        </div>

        {/* Emprendedor */}
        <aside className="h-fit rounded-2xl border border-borde bg-carta p-6">
          <p className="mb-4 flex items-center gap-2 font-acento text-xs font-semibold uppercase tracking-wider text-texto-suave">
            <ChefHat size={14} className="text-violeta" /> El emprendedor
          </p>
          <Link
            to={`/emprendedores/${e.id}`}
            className="font-titulo text-xl font-bold text-texto transition-colors hover:text-violeta"
          >
            {e.nombre}
          </Link>
          {e.especialidad && <p className="mt-0.5 text-sm text-cian">{e.especialidad}</p>}
          {e.descripcion && <p className="mt-3 text-sm leading-relaxed text-texto-suave">{e.descripcion}</p>}

          <div className="mt-4 space-y-2 border-t border-borde pt-4">
            {e.telefono && (
              <p className="flex items-center gap-2 text-sm text-texto">
                <Phone size={14} className="shrink-0 text-violeta" /> {e.telefono}
              </p>
            )}
            {e.correoSecundario && (
              <p className="flex items-center gap-2 text-sm text-texto">
                <Mail size={14} className="shrink-0 text-magenta" /> {e.correoSecundario}
              </p>
            )}
          </div>

          <div className="mt-4">
            <RedesSociales redes={e.redesSociales} />
          </div>

          <Link
            to={`/emprendedores/${e.id}`}
            className="mt-5 block w-full rounded-lg bg-violeta py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-violeta-suave"
          >
            Ver todos sus parches
          </Link>
        </aside>
      </div>
    </div>
  );
}
