import { Loader2, MapPinOff, TriangleAlert } from 'lucide-react';

export function Cargando({ mensaje = 'Buscando parches...' }: { mensaje?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-texto-suave">
      <Loader2 className="animate-spin text-violeta" size={32} />
      <p className="text-sm">{mensaje}</p>
    </div>
  );
}

export function EstadoVacio({ titulo, detalle }: { titulo: string; detalle?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-borde bg-carta px-6 py-14 text-center">
      <MapPinOff className="text-texto-suave" size={36} />
      <p className="font-semibold text-texto">{titulo}</p>
      {detalle && <p className="max-w-md text-sm text-texto-suave">{detalle}</p>}
    </div>
  );
}

export function EstadoError({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-magenta/30 bg-magenta/10 p-4">
      <TriangleAlert className="mt-0.5 shrink-0 text-magenta" size={18} />
      <p className="text-sm text-magenta">{mensaje}</p>
    </div>
  );
}
