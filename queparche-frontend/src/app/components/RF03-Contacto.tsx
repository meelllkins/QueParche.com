import React from 'react';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function RF03Contacto() {
  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-[var(--queparche-magenta)]">Contacto y Soporte (RF03)</h1>
          <p className="text-muted-foreground">Contáctanos / Quejas y Reclamos</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Envíanos un mensaje</h2>
            <form className="space-y-5">
              {[
                { label: 'Nombre Completo', type: 'text', placeholder: 'Tu nombre completo' },
                { label: 'Correo Electrónico', type: 'email', placeholder: 'tucorreo@ejemplo.com' },
                { label: 'Asunto', type: 'text', placeholder: 'Motivo de tu mensaje' },
              ].map((f) => (
                <div key={f.label}>
                  <label className="block text-sm font-medium mb-2 text-foreground">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-magenta)] focus:border-transparent transition-all" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Mensaje</label>
                <textarea rows={5} placeholder="Escribe tu mensaje aquí..." className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-magenta)] focus:border-transparent transition-all resize-none"></textarea>
              </div>
              <button type="submit" className="w-full py-4 rounded-lg font-semibold text-lg bg-[var(--queparche-magenta)] text-foreground hover:bg-[var(--queparche-magenta-light)] transition-colors">Enviar</button>
            </form>
          </div>
          <div className="space-y-6">
            <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-xl">
              <h2 className="text-2xl font-bold mb-6 text-foreground">Información de contacto directo</h2>
              <div className="space-y-6">
                <p className="text-muted-foreground leading-relaxed">¿Tienes preguntas o necesitas ayuda? Nuestro equipo está disponible para asistirte.</p>
                <div className="h-px bg-border"></div>
                {[
                  { icon: Phone, color: 'violet', label: 'Teléfono', value: '(000) 000-0000' },
                  { icon: Mail, color: 'magenta', label: 'Email', value: 'correo@ejemplo.com' },
                  { icon: MapPin, color: 'cyan', label: 'Dirección', value: 'Lorem Ipsum 123, Ciudad, País' },
                  { icon: Clock, color: 'violet', label: 'Horario', value: 'Lun - Vie: 8:00 - 17:00' },
                ].map(({ icon: Icon, color, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg bg-[var(--queparche-${color})]/10 flex items-center justify-center flex-shrink-0`}>
                      <Icon size={20} className={`text-[var(--queparche-${color})]`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground mb-1">{label}</p>
                      <p className="text-base text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[var(--queparche-gray)] rounded-2xl p-6 border border-border">
              <p className="text-sm text-foreground text-center font-medium">🌟 Respuesta promedio en menos de 24 horas</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
