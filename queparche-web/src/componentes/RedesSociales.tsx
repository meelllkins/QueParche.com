import { Facebook, Instagram, Link2, Linkedin, Music2, Twitter, Youtube, type LucideIcon } from 'lucide-react';

const ICONOS: Record<string, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  x: Twitter,
  linkedin: Linkedin,
  tiktok: Music2,
  youtube: Youtube,
};

const NOMBRES: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  x: 'X',
  linkedin: 'LinkedIn',
  tiktok: 'TikTok',
  youtube: 'YouTube',
};

/** Iconos-enlace a las redes sociales de un emprendedor. */
export function RedesSociales({ redes }: { redes: Record<string, string> }) {
  const entradas = Object.entries(redes);
  if (entradas.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {entradas.map(([plataforma, url]) => {
        const Icono = ICONOS[plataforma] ?? Link2;
        return (
          <a
            key={plataforma}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={NOMBRES[plataforma] ?? plataforma}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-borde bg-carta-alt text-texto-suave transition-colors hover:border-cian hover:text-cian"
          >
            <Icono size={16} />
          </a>
        );
      })}
    </div>
  );
}
