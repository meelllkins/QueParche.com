import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { crearServicio } from '../../services/api';
import type { ErrorResponse, ServicioResponse } from '../../types/api';

// RF10 — Publicación de información del servicio → POST /api/v1/servicios
export function RF10InformacionServicio() {
  const [form, setForm] = useState({
    emprendedorId: '',
    nombre: '',
    descripcion: '',
    fecha: '',
    hora: '',
    latitud: '',
    longitud: '',
    direccion: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<ServicioResponse | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Combina fecha + hora en el formato ISO que espera LocalDateTime
      const fechaHora = `${form.fecha}T${form.hora}:00`;
      const res = await crearServicio({
        emprendedorId: form.emprendedorId,
        nombre: form.nombre,
        descripcion: form.descripcion,
        fechaHora,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        direccion: form.direccion,
      });
      setSuccess(res.data);
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.message ?? 'Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'violet': return 'bg-[var(--queparche-violet)]/10 text-[var(--queparche-violet)]';
      case 'magenta': return 'bg-[var(--queparche-magenta)]/10 text-[var(--queparche-magenta)]';
      case 'cyan': return 'bg-[var(--queparche-cyan)]/10 text-[var(--queparche-cyan)]';
      default: return 'bg-[var(--queparche-violet)]/10 text-[var(--queparche-violet)]';
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-2xl text-center">
            <CheckCircle size={56} className="text-[var(--queparche-cyan)] mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">¡Servicio publicado!</h2>
            <p className="text-muted-foreground mb-6">
              <span className="text-[var(--queparche-violet)] font-semibold">{success.nombre}</span> ya está visible en QueParche.
            </p>
            <div className="bg-input-background rounded-lg p-4 text-left text-sm grid grid-cols-2 gap-x-4 gap-y-2">
              <span className="text-muted-foreground">ID:</span>
              <span className="text-[var(--queparche-cyan)] font-mono text-xs break-all">{success.id}</span>
              <span className="text-muted-foreground">Nombre:</span>
              <span className="text-foreground">{success.nombre}</span>
              <span className="text-muted-foreground">Fecha:</span>
              <span className="text-foreground">{new Date(success.fechaHora).toLocaleString('es-CO')}</span>
              <span className="text-muted-foreground">Dirección:</span>
              <span className="text-foreground">{success.direccion}</span>
              <span className="text-muted-foreground">Coordenadas:</span>
              <span className="text-foreground">{success.latitud}, {success.longitud}</span>
            </div>
            <button
              onClick={() => { setSuccess(null); setForm({ emprendedorId: '', nombre: '', descripcion: '', fecha: '', hora: '', latitud: '', longitud: '', direccion: '' }); }}
              className="mt-6 py-3 px-8 rounded-lg font-semibold bg-[var(--queparche-cyan)] text-background hover:bg-[var(--queparche-cyan-dark)] transition-colors"
            >
              Publicar otro servicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const fields = [
    { name: 'emprendedorId', label: 'ID del Emprendedor', placeholder: 'UUID del emprendedor registrado', icon: User, color: 'violet', type: 'text' },
    { name: 'nombre', label: 'Nombre del Servicio', placeholder: 'Ej: Arepas de Chócolo', icon: FileText, color: 'magenta', type: 'text' },
    { name: 'fecha', label: 'Fecha', placeholder: '', icon: Calendar, color: 'cyan', type: 'date' },
    { name: 'hora', label: 'Hora', placeholder: '', icon: Clock, color: 'violet', type: 'time' },
    { name: 'latitud', label: 'Latitud', placeholder: '6.2518', icon: MapPin, color: 'magenta', type: 'number' },
    { name: 'longitud', label: 'Longitud', placeholder: '-75.5636', icon: MapPin, color: 'cyan', type: 'number' },
    { name: 'direccion', label: 'Dirección', placeholder: 'Cra. 49 #53-56, Medellín', icon: MapPin, color: 'violet', type: 'text' },
  ] as const;

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-violet)]"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[var(--queparche-cyan)]">
            Publicar Servicio (RF10)
          </h1>
          <p className="text-muted-foreground text-center">Información del Servicio</p>
        </div>

        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Información del Servicio</h2>

          {error && (
            <div className="flex items-start gap-3 mb-5 p-4 bg-[var(--queparche-magenta)]/10 border border-[var(--queparche-magenta)]/30 rounded-lg">
              <AlertCircle size={18} className="text-[var(--queparche-magenta)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--queparche-magenta)]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {fields.map((field) => {
              const IconComponent = field.icon;
              return (
                <div
                  key={field.name}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-input-background border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClass(field.color)}`}>
                      <IconComponent size={20} />
                    </div>
                    <span className="font-semibold text-foreground">{field.label}:</span>
                  </div>
                  <div className="flex items-center md:justify-end">
                    <input
                      name={field.name}
                      type={field.type}
                      value={form[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required
                      step={field.type === 'number' ? 'any' : undefined}
                      className="w-full md:max-w-xs px-4 py-2 bg-[var(--queparche-gray)] border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-cyan)] focus:border-transparent transition-all font-mono text-sm"
                    />
                  </div>
                </div>
              );
            })}

            {/* Descripción — ancho completo */}
            <div className="p-4 rounded-xl bg-input-background border border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getColorClass('magenta')}`}>
                  <FileText size={20} />
                </div>
                <span className="font-semibold text-foreground">Descripción:</span>
              </div>
              <textarea
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Describe tu servicio de comida callejera..."
                required
                rows={3}
                className="w-full px-4 py-2 bg-[var(--queparche-gray)] border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-cyan)] focus:border-transparent transition-all text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-4 rounded-lg font-semibold text-lg bg-[var(--queparche-cyan)] text-background hover:bg-[var(--queparche-cyan-dark)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Publicando...
                </span>
              ) : 'Publicar Servicio'}
            </button>
          </form>
        </div>

        <div className="mt-6 bg-[var(--queparche-gray)] rounded-xl p-4 border border-border">
          <p className="text-sm text-center text-muted-foreground">
            💡 Verifica que toda la información sea correcta antes de publicar
          </p>
        </div>
      </div>
    </div>
  );
}
