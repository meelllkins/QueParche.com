import React from 'react';
import { Logo } from './Logo';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export function RF07Footer() {
  return (
    <div className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
          <div className="md:col-span-3 flex justify-center md:justify-start">
            <div className="bg-card p-6 rounded-xl border border-border"><Logo variant="icon" size="lg" /></div>
          </div>
          <div className="md:col-span-5 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
            {[
              { href: '#inicio', label: 'Inicio', color: 'violet' },
              { href: '#nosotros', label: 'Nosotros', color: 'magenta' },
              { href: '#contacto', label: 'Contáctanos', color: 'cyan' },
            ].map(({ href, label, color }) => (
              <React.Fragment key={label}>
                <a href={href} className={`text-foreground hover:text-[var(--queparche-${color})] font-medium transition-colors duration-200 text-base`}>{label}</a>
                {label !== 'Contáctanos' && <div className="h-8 w-px bg-border hidden md:block"></div>}
              </React.Fragment>
            ))}
          </div>
          <div className="md:col-span-4">
            <p className="text-sm font-semibold text-foreground mb-4 text-center md:text-right">Síguenos</p>
            <div className="flex justify-center md:justify-end gap-4">
              {[
                { href: '#facebook', bg: '#1877F2', Icon: Facebook, label: 'Facebook' },
                { href: '#twitter', bg: '#1DA1F2', Icon: Twitter, label: 'Twitter' },
                { href: '#linkedin', bg: '#0A66C2', Icon: Linkedin, label: 'LinkedIn' },
                { href: '#instagram', bg: '#E4405F', Icon: Instagram, label: 'Instagram' },
              ].map(({ href, bg, Icon, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-12 h-12 rounded-lg flex items-center justify-center transition-opacity hover:opacity-80"
                  style={{ backgroundColor: bg }}>
                  <Icon size={24} className="text-white" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">© 2026 QueParche. Visibilizando la gastronomía callejera de Medellín.</p>
          <div className="flex gap-6">
            <a href="#privacidad" className="text-sm text-muted-foreground hover:text-[var(--queparche-cyan)] transition-colors">Privacidad</a>
            <a href="#terminos" className="text-sm text-muted-foreground hover:text-[var(--queparche-cyan)] transition-colors">Términos</a>
          </div>
        </div>
      </div>
      <div className="h-1 bg-[var(--queparche-violet)]"></div>
    </div>
  );
}
