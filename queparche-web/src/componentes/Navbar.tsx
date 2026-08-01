import { Link, NavLink } from 'react-router-dom';
import { ChefHat, Compass, LayoutDashboard, Users } from 'lucide-react';
import { useActor } from '../contexto/ActorContext';
import { Logo } from './Logo';

const enlaces = [
  { a: '/', texto: 'Explorar', icono: Compass, exacto: true },
  { a: '/emprendedores', texto: 'Emprendedores', icono: Users, exacto: false },
  { a: '/panel', texto: 'Mi panel', icono: LayoutDashboard, exacto: false },
];

export function Navbar() {
  const { actor, elegirActor, emprendedores } = useActor();

  return (
    <nav className="sticky top-0 z-[1100] border-b border-borde bg-fondo/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80">
          <Logo tamano={34} />
          <span className="hidden font-titulo text-lg font-extrabold text-texto sm:block">
            Que<span className="texto-degradado">Parche</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {enlaces.map(({ a, texto, icono: Icono, exacto }) => (
            <NavLink
              key={a}
              to={a}
              end={exacto}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-violeta/15 text-violeta'
                    : 'text-texto-suave hover:bg-carta-alt hover:text-texto'
                }`
              }
            >
              <Icono size={16} />
              <span className="hidden md:inline">{texto}</span>
            </NavLink>
          ))}
        </div>

        {/* Selector de perfil: sustituto de login en esta versión */}
        <div className="flex items-center gap-2">
          <ChefHat size={16} className="hidden text-cian sm:block" />
          <select
            value={actor?.id ?? ''}
            onChange={(e) => {
              const elegido = emprendedores.find((emp) => emp.id === e.target.value);
              elegirActor(elegido ? { id: elegido.id, nombre: elegido.nombre } : null);
            }}
            title="Elige con qué emprendedor estás actuando"
            className="max-w-[150px] cursor-pointer rounded-lg border border-borde bg-carta-alt px-2.5 py-2 text-sm text-texto focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violeta sm:max-w-[210px]"
          >
            <option value="">Soy visitante</option>
            {emprendedores.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}
