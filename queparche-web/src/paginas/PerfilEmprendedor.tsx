import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { api, ErrorApi } from '../api/cliente';
import type { PerfilEmprendedorCompleto, ServicioConEmprendedor } from '../api/tipos';
import { TarjetaServicio } from '../componentes/TarjetaServicio';
import { RedesSociales } from '../componentes/RedesSociales';
import { Cargando, EstadoError, EstadoVacio } from '../componentes/Estados';
import { esPasado } from '../utilidades/fechas';

/** Perfil público de un emprendedor con todos sus servicios. */
export function PerfilEmprendedor() {
  const { id } = useParams<{ id: string }>();
  const [perfil, setPerfil] = useState<PerfilEmprendedorCompleto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .get<PerfilEmprendedorCompleto>(`/api/emprendedores/${id}`)
      .then(setPerfil)
      .catch((e) => setError(e instanceof ErrorApi ? e.message : 'No pudimos cargar el perfil'));
  }, [id]);

  if (error) return <EstadoError mensaje={error} />;
  if (!perfil) return <Cargando mensaje="Cargando el perfil..." />;

  // Adaptamos los servicios al shape de la tarjeta (que espera el emprendedor embebido).
  const conEmprendedor: ServicioConEmprendedor[] = perfil.servicios.map((s) => ({
    ...s,
    emprendedor: { id: perfil.id, nombre: perfil.nombre, especialidad: perfil.especialidad },
  }));
  const proximos = conEmprendedor.filter((s) => !esPasado(s.fechaHora));
  const pasados = conEmprendedor.filter((s) => esPasado(s.fechaHora));

  return (
    <div className="space-y-8">
      <Link
        to="/emprendedores"
        className="inline-flex items-center gap-1.5 text-sm text-texto-suave hover:text-cian"
      >
        <ArrowLeft size={15} /> Todos los emprendedores
      </Link>

      {/* Cabecera del perfil */}
      <header className="rounded-2xl border border-borde bg-carta p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl barra-degradado font-titulo text-2xl font-black text-white">
            {perfil.nombre
              .split(/\s+/)
              .slice(0, 2)
              .map((p) => p[0]?.toUpperCase() ?? '')
              .join('')}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-titulo text-3xl font-black text-texto">{perfil.nombre}</h1>
            {perfil.especialidad && <p className="mt-0.5 font-acento text-cian">{perfil.especialidad}</p>}
            {perfil.descripcion && (
              <p className="mt-3 max-w-2xl leading-relaxed text-texto-suave">{perfil.descripcion}</p>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
              {perfil.telefono && (
                <span className="flex items-center gap-2 text-sm text-texto">
                  <Phone size={14} className="text-violeta" /> {perfil.telefono}
                </span>
              )}
              {perfil.correoSecundario && (
                <span className="flex items-center gap-2 text-sm text-texto">
                  <Mail size={14} className="text-magenta" /> {perfil.correoSecundario}
                </span>
              )}
              <RedesSociales redes={perfil.redesSociales} />
            </div>
          </div>
        </div>
      </header>

      {/* Servicios */}
      <section className="space-y-6">
        <h2 className="font-titulo text-xl font-bold text-texto">Sus parches</h2>
        {conEmprendedor.length === 0 ? (
          <EstadoVacio titulo="Este emprendedor todavía no ha publicado parches" />
        ) : (
          <>
            {proximos.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {proximos.map((s) => (
                  <TarjetaServicio key={s.id} servicio={s} />
                ))}
              </div>
            )}
            {pasados.length > 0 && (
              <details className="group">
                <summary className="cursor-pointer text-sm font-semibold text-texto-suave transition-colors hover:text-texto">
                  Ver {pasados.length} {pasados.length === 1 ? 'parche pasado' : 'parches pasados'}
                </summary>
                <div className="mt-4 grid grid-cols-1 gap-4 opacity-60 sm:grid-cols-2 lg:grid-cols-3">
                  {pasados.map((s) => (
                    <TarjetaServicio key={s.id} servicio={s} />
                  ))}
                </div>
              </details>
            )}
          </>
        )}
      </section>
    </div>
  );
}
