import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, Save } from 'lucide-react';
import { api, ErrorApi } from '../api/cliente';
import { useActor } from '../contexto/ActorContext';
import type { UsuarioPropio } from '../api/tipos';
import { EstadoError, EstadoVacio } from '../componentes/Estados';

/** Plataformas de la lista blanca del dominio (el backend valida cada URL). */
const PLATAFORMAS = [
  { clave: 'instagram', nombre: 'Instagram', ejemplo: 'https://instagram.com/tuperfil' },
  { clave: 'facebook', nombre: 'Facebook', ejemplo: 'https://facebook.com/tupagina' },
  { clave: 'tiktok', nombre: 'TikTok', ejemplo: 'https://tiktok.com/@tuperfil' },
  { clave: 'x', nombre: 'X (Twitter)', ejemplo: 'https://x.com/tuperfil' },
  { clave: 'youtube', nombre: 'YouTube', ejemplo: 'https://youtube.com/@tucanal' },
  { clave: 'linkedin', nombre: 'LinkedIn', ejemplo: 'https://linkedin.com/in/tuperfil' },
] as const;

/** Edición del perfil del emprendedor: contacto, bio y redes sociales. */
export function EditarPerfil() {
  const { actor, elegirActor } = useActor();
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correoSecundario, setCorreoSecundario] = useState('');
  const [redes, setRedes] = useState<Record<string, string>>({});
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detalles, setDetalles] = useState<{ campo: string; mensaje: string }[]>([]);

  useEffect(() => {
    if (!actor) return;
    api
      .get<UsuarioPropio>('/api/usuarios/yo', actor.id)
      .then((u) => {
        setNombre(u.nombre);
        setEspecialidad(u.especialidad ?? '');
        setDescripcion(u.descripcion ?? '');
        setTelefono(u.telefono ?? '');
        setCorreoSecundario(u.correoSecundario ?? '');
        setRedes(u.redesSociales ?? {});
      })
      .catch((e) => setError(e instanceof ErrorApi ? e.message : 'No pudimos cargar tu perfil'))
      .finally(() => setCargando(false));
  }, [actor]);

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
    setGuardado(false);
    // Solo se envían las redes con URL no vacía
    const redesLimpias = Object.fromEntries(
      Object.entries(redes).filter(([, url]) => url.trim() !== ''),
    );
    try {
      setEnviando(true);
      await api.put(
        `/api/usuarios/${actor.id}/perfil`,
        { nombre, especialidad, descripcion, telefono, correoSecundario, redesSociales: redesLimpias },
        actor.id,
      );
      // Si cambió el nombre, sincronizamos el selector
      elegirActor({ id: actor.id, nombre: nombre.trim() || actor.nombre });
      setGuardado(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      if (err instanceof ErrorApi) {
        setError(err.message);
        setDetalles(err.detalles ?? []);
      } else {
        setError('Ocurrió un error inesperado');
      }
    } finally {
      setEnviando(false);
    }
  };

  const claseInput =
    'w-full rounded-lg border border-borde bg-carta-alt px-3 py-2.5 text-sm text-texto placeholder:text-texto-suave focus:border-transparent focus:outline-none focus:ring-2 focus:ring-cian';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/panel" className="inline-flex items-center gap-1.5 text-sm text-texto-suave hover:text-cian">
        <ArrowLeft size={15} /> Volver al panel
      </Link>

      <header>
        <h1 className="font-titulo text-3xl font-black text-texto">Mi perfil</h1>
        <p className="mt-1 text-sm text-texto-suave">
          Esta información es la que ven los clientes cuando visitan tus parches.
        </p>
      </header>

      {guardado && (
        <div className="flex items-center gap-3 rounded-xl border border-cian/30 bg-cian/10 p-4">
          <CheckCircle2 className="shrink-0 text-cian" size={18} />
          <p className="text-sm text-cian">Perfil actualizado. ¡Así se hace, parcero!</p>
        </div>
      )}
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

      {cargando ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-cian" size={28} />
        </div>
      ) : (
        <form onSubmit={enviar} className="space-y-6">
          <section className="space-y-5 rounded-2xl border border-borde bg-carta p-6">
            <h2 className="font-titulo font-bold text-texto">Datos básicos</h2>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-texto">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                maxLength={100}
                className={claseInput}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-texto">
                Especialidad <span className="text-texto-suave">(qué vendes)</span>
              </label>
              <input
                type="text"
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                placeholder="Ej: Arepas de chócolo"
                maxLength={80}
                className={claseInput}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-texto">
                Bio <span className="text-texto-suave">(cuenta tu historia)</span>
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="¿Hace cuánto empezaste? ¿Qué hace único a tu sazón?"
                rows={3}
                maxLength={500}
                className={`${claseInput} resize-none`}
              />
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-borde bg-carta p-6">
            <h2 className="font-titulo font-bold text-texto">Contacto</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-texto">Teléfono</label>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="+57 300 123 4567"
                  className={claseInput}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-texto">Correo de contacto</label>
                <input
                  type="email"
                  value={correoSecundario}
                  onChange={(e) => setCorreoSecundario(e.target.value)}
                  placeholder="pedidos@tunegocio.com"
                  className={claseInput}
                />
              </div>
            </div>
          </section>

          <section className="space-y-5 rounded-2xl border border-borde bg-carta p-6">
            <div>
              <h2 className="font-titulo font-bold text-texto">Redes sociales</h2>
              <p className="mt-1 text-xs text-texto-suave">
                Solo se aceptan enlaces de facebook, instagram, twitter/x, linkedin, tiktok y youtube. Deja en
                blanco las que no uses.
              </p>
            </div>
            {PLATAFORMAS.map((p) => (
              <div key={p.clave}>
                <label className="mb-1.5 block text-sm font-medium text-texto">{p.nombre}</label>
                <input
                  type="url"
                  value={redes[p.clave] ?? ''}
                  onChange={(e) => setRedes((prev) => ({ ...prev, [p.clave]: e.target.value }))}
                  placeholder={p.ejemplo}
                  className={claseInput}
                />
              </div>
            ))}
          </section>

          <button
            type="submit"
            disabled={enviando}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cian py-3.5 font-semibold text-fondo transition-colors hover:bg-cian-oscuro disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? (
              <>
                <Loader2 className="animate-spin" size={18} /> Guardando...
              </>
            ) : (
              <>
                <Save size={18} /> Guardar perfil
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
