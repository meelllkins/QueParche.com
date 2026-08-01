import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { esPasado, etiquetaDia, horaLocal } from '../utilidades/fechas';
import type { ServicioConEmprendedor } from '../api/tipos';

/** Tarjeta de servicio para listados. Toda la tarjeta enlaza al detalle. */
export function TarjetaServicio({ servicio }: { servicio: ServicioConEmprendedor }) {
  const pasado = esPasado(servicio.fechaHora);
  const dia = etiquetaDia(servicio.fechaHora);
  const esHoy = dia === 'Hoy';

  return (
    <Link
      to={`/servicios/${servicio.id}`}
      className="group flex flex-col gap-3 rounded-2xl border border-borde bg-carta p-5 transition-all hover:-translate-y-0.5 hover:border-violeta/60"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
            pasado
              ? 'bg-carta-alt text-texto-suave'
              : esHoy
                ? 'bg-magenta/15 text-magenta'
                : 'bg-violeta/15 text-violeta'
          }`}
        >
          <Clock size={12} />
          {pasado ? 'Finalizado' : `${dia} · ${horaLocal(servicio.fechaHora)}`}
        </span>
        {servicio.emprendedor.especialidad && (
          <span className="rounded-full bg-cian/10 px-2.5 py-1 text-xs font-semibold text-cian">
            {servicio.emprendedor.especialidad}
          </span>
        )}
      </div>

      <div>
        <h3 className="font-titulo text-lg font-bold text-texto transition-colors group-hover:text-violeta">
          {servicio.nombre}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-texto-suave">{servicio.descripcion}</p>
      </div>

      <div className="mt-auto space-y-1 border-t border-borde pt-3">
        <p className="flex items-center gap-1.5 text-xs text-texto-suave">
          <MapPin size={12} className="shrink-0 text-cian" />
          <span className="truncate">{servicio.direccion}</span>
        </p>
        <p className="text-xs text-texto-suave">
          por <span className="font-semibold text-texto">{servicio.emprendedor.nombre}</span>
        </p>
      </div>
    </Link>
  );
}
