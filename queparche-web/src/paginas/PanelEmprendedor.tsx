import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ChefHat, MapPin, Pencil, Plus, Trash2, UserCog } from 'lucide-react';
import { api, ErrorApi } from '../api/cliente';
import { useActor } from '../contexto/ActorContext';
import type { ServicioConEmprendedor } from '../api/tipos';
import { Cargando, EstadoError, EstadoVacio } from '../componentes/Estados';
import { esPasado, etiquetaDia, fechaLarga, horaLocal } from '../utilidades/fechas';

/** Panel del emprendedor: sus servicios con editar/eliminar, y acceso a perfil. */
export function PanelEmprendedor() {
  const { actor, elegirActor, emprendedores } = useActor();
  const [servicios, setServicios] = useState<ServicioConEmprendedor[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [eliminando, setEliminando] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    if (!actor) return;
    try {
      setError(null);
      const lista = await api.get<ServicioConEmprendedor[]>(
        `/api/servicios?emprendedorId=${actor.id}&proximos=0`,
      );
      setServicios(lista);
    } catch (e) {
      setError(e instanceof ErrorApi ? e.message : 'No pudimos cargar tus servicios');
      setServicios([]);
    }
  }, [actor]);

  useEffect(() => {
    setServicios(null);
    void cargar();
  }, [cargar]);

  const eliminar = async (id: string, nombre: string) => {
    if (!actor) return;
    if (!window.confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    try {
      setEliminando(id);
      await api.del(`/api/servicios/${id}`, actor.id);
      await cargar();
    } catch (e) {
      setError(e instanceof ErrorApi ? e.message : 'No pudimos eliminar el servicio');
    } finally {
      setEliminando(null);
    }
  };

  // Sin actor elegido: invitación a escoger perfil (el sustituto de login de esta versión)
  if (!actor) {
    return (
      <div className="mx-auto max-w-lg space-y-6 pt-8 text-center">
        <ChefHat size={48} className="mx-auto text-violeta" />
        <h1 className="font-titulo text-3xl font-black text-texto">Panel del emprendedor</h1>
        <p className="text-texto-suave">
          Elige con qué perfil de emprendedor quieres actuar. En esta versión no hay contraseñas: el selector
          simula la sesión (la autenticación real llega después).
        </p>
        <div className="space-y-2">
          {emprendedores.map((e) => (
            <button
              key={e.id}
              onClick={() => elegirActor({ id: e.id, nombre: e.nombre })}
              className="flex w-full items-center justify-between rounded-xl border border-borde bg-carta px-5 py-3.5 text-left transition-colors hover:border-violeta/60"
            >
              <span>
                <span className="block font-semibold text-texto">{e.nombre}</span>
                {e.especialidad && <span className="text-sm text-cian">{e.especialidad}</span>}
              </span>
              <span className="text-sm text-texto-suave">Entrar →</span>
            </button>
          ))}
          {emprendedores.length === 0 && (
            <EstadoVacio titulo="No hay emprendedores en la base de datos" detalle="Ejecuta `npm run seed`." />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-acento text-xs font-semibold uppercase tracking-wider text-texto-suave">
            Panel de emprendedor
          </p>
          <h1 className="mt-1 font-titulo text-3xl font-black text-texto">Hola, {actor.nombre} 👋</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/panel/perfil"
            className="flex items-center gap-2 rounded-lg border border-borde bg-carta px-4 py-2.5 text-sm font-semibold text-texto transition-colors hover:border-cian/60"
          >
            <UserCog size={16} className="text-cian" /> Mi perfil
          </Link>
          <Link
            to="/panel/nuevo"
            className="flex items-center gap-2 rounded-lg bg-violeta px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violeta-suave"
          >
            <Plus size={16} /> Publicar parche
          </Link>
        </div>
      </header>

      {error && <EstadoError mensaje={error} />}

      {servicios === null ? (
        <Cargando mensaje="Cargando tus parches..." />
      ) : servicios.length === 0 ? (
        <EstadoVacio
          titulo="Todavía no has publicado ningún parche"
          detalle="Publica tu primer servicio y aparece en el mapa de Medellín."
        />
      ) : (
        <div className="space-y-3">
          {servicios.map((s) => {
            const pasado = esPasado(s.fechaHora);
            return (
              <div
                key={s.id}
                className="flex flex-col gap-4 rounded-2xl border border-borde bg-carta p-5 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-titulo font-bold text-texto">{s.nombre}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        pasado ? 'bg-carta-alt text-texto-suave' : 'bg-cian/10 text-cian'
                      }`}
                    >
                      {pasado ? 'Finalizado' : `${etiquetaDia(s.fechaHora)} · ${horaLocal(s.fechaHora)}`}
                    </span>
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-texto-suave">
                    <CalendarDays size={12} /> {fechaLarga(s.fechaHora)}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-xs text-texto-suave">
                    <MapPin size={12} /> <span className="truncate">{s.direccion}</span>
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    to={`/servicios/${s.id}`}
                    className="rounded-lg border border-borde px-3 py-2 text-xs font-semibold text-texto-suave transition-colors hover:text-texto"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/panel/${s.id}/editar`}
                    className="flex items-center gap-1.5 rounded-lg border border-borde px-3 py-2 text-xs font-semibold text-cian transition-colors hover:border-cian/60"
                  >
                    <Pencil size={13} /> Editar
                  </Link>
                  <button
                    onClick={() => eliminar(s.id, s.nombre)}
                    disabled={eliminando === s.id}
                    className="flex items-center gap-1.5 rounded-lg border border-borde px-3 py-2 text-xs font-semibold text-magenta transition-colors hover:border-magenta/60 disabled:opacity-50"
                  >
                    <Trash2 size={13} /> {eliminando === s.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
