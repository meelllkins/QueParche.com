import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, Rocket } from 'lucide-react';
import { api, ErrorApi } from '../api/cliente';
import { useActor } from '../contexto/ActorContext';
import type { Servicio, ServicioDetalle } from '../api/tipos';
import { SelectorUbicacion, type Ubicacion } from '../componentes/mapa/SelectorUbicacion';
import { EstadoError, EstadoVacio } from '../componentes/Estados';
import { inputLocalAIso, isoAInputLocal, minimoInputLocal } from '../utilidades/fechas';

/** Crear o editar un servicio. La ubicación se elige en el mapa, nunca a mano. */
export function FormularioServicio() {
  const { id } = useParams<{ id: string }>();
  const editando = Boolean(id);
  const navegar = useNavigate();
  const { actor } = useActor();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaLocal, setFechaLocal] = useState('');
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [cargandoDatos, setCargandoDatos] = useState(editando);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detalles, setDetalles] = useState<{ campo: string; mensaje: string }[]>([]);

  // Modo edición: precargar el servicio
  useEffect(() => {
    if (!editando || !id) return;
    api
      .get<ServicioDetalle>(`/api/servicios/${id}`)
      .then((s) => {
        setNombre(s.nombre);
        setDescripcion(s.descripcion);
        setFechaLocal(isoAInputLocal(s.fechaHora));
        setUbicacion({ latitud: s.latitud, longitud: s.longitud, direccion: s.direccion });
      })
      .catch((e) => setError(e instanceof ErrorApi ? e.message : 'No pudimos cargar el servicio'))
      .finally(() => setCargandoDatos(false));
  }, [editando, id]);

  if (!actor) {
    return (
      <EstadoVacio
        titulo="Primero elige tu perfil de emprendedor"
        detalle="Usa el selector de la barra superior o entra al panel para escoger con quién actúas."
      />
    );
  }

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setDetalles([]);
    if (!ubicacion) {
      setError('Falta la ubicación: haz clic en el mapa o busca la dirección de tu parche.');
      return;
    }
    if (!fechaLocal) {
      setError('Falta la fecha y hora del parche.');
      return;
    }
    const cuerpo = {
      nombre,
      descripcion,
      fechaHora: inputLocalAIso(fechaLocal),
      latitud: ubicacion.latitud,
      longitud: ubicacion.longitud,
      direccion: ubicacion.direccion,
    };
    try {
      setEnviando(true);
      const guardado = editando
        ? await api.put<Servicio>(`/api/servicios/${id}`, cuerpo, actor.id)
        : await api.post<Servicio>('/api/servicios', cuerpo, actor.id);
      navegar(`/servicios/${guardado.id}`);
    } catch (err) {
      if (err instanceof ErrorApi) {
        setError(err.message);
        setDetalles(err.detalles ?? []);
      } else {
        setError('Ocurrió un error inesperado');
      }
      setEnviando(false);
    }
  };

  const claseInput =
    'w-full rounded-lg border border-borde bg-carta-alt px-3 py-2.5 text-sm text-texto placeholder:text-texto-suave focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violeta';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/panel" className="inline-flex items-center gap-1.5 text-sm text-texto-suave hover:text-cian">
        <ArrowLeft size={15} /> Volver al panel
      </Link>

      <header>
        <h1 className="font-titulo text-3xl font-black text-texto">
          {editando ? 'Editar parche' : 'Publicar un parche'}
        </h1>
        <p className="mt-1 text-sm text-texto-suave">
          Publicando como <span className="font-semibold text-violeta">{actor.nombre}</span>
        </p>
      </header>

      {error && (
        <div className="space-y-2">
          <EstadoError mensaje={error} />
          {detalles.length > 0 && (
            <ul className="ml-1 list-inside list-disc space-y-0.5 text-xs text-magenta">
              {detalles.map((d, i) => (
                <li key={i}>
                  {d.campo ? <span className="font-semibold">{d.campo}: </span> : null}
                  {d.mensaje}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {cargandoDatos ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-violeta" size={28} />
        </div>
      ) : (
        <form onSubmit={enviar} className="space-y-5 rounded-2xl border border-borde bg-carta p-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-texto">Nombre del parche</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Arepas de chócolo con quesito"
              required
              maxLength={100}
              className={claseInput}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-texto">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="¿Qué vendes? ¿Qué lo hace especial? Antoja a la gente..."
              required
              rows={4}
              maxLength={1000}
              className={`${claseInput} resize-none`}
            />
            <p className="mt-1 text-right text-xs text-texto-suave">{descripcion.length}/1000</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-texto">Fecha y hora</label>
            <input
              type="datetime-local"
              value={fechaLocal}
              onChange={(e) => setFechaLocal(e.target.value)}
              min={minimoInputLocal()}
              required
              className={claseInput}
            />
            <p className="mt-1 text-xs text-texto-suave">Debe ser una fecha futura.</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-texto">Ubicación</label>
            <SelectorUbicacion valor={ubicacion} onCambio={setUbicacion} />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violeta py-3.5 font-semibold text-white transition-colors hover:bg-violeta-suave disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Guardando...
              </>
            ) : (
              <>
                <Rocket size={18} /> {editando ? 'Guardar cambios' : 'Publicar parche'}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
