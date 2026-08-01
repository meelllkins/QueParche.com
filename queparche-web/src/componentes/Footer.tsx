import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-borde">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row">
        <div className="flex items-center gap-2.5">
          <Logo tamano={28} />
          <p className="text-sm text-texto-suave">
            © {new Date().getFullYear()} QueParche — Visibilizando la gastronomía callejera de Medellín.
          </p>
        </div>
        <p className="font-acento text-xs text-texto-suave">
          Hecho con 🔥 en la ciudad de la eterna primavera
        </p>
      </div>
      <div className="h-1 barra-degradado" />
    </footer>
  );
}
