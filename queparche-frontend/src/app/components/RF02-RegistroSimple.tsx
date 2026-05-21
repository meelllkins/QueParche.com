import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { registrarEmprendedor } from '../../services/api';
import type { ErrorResponse, UsuarioResponse } from '../../types/api';

// RF02 — Registro simple de emprendedor conectado a POST /api/v1/usuarios/emprendedores
export function RF02RegistroSimple() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ nombre: '', email: '', contrasena: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<UsuarioResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await registrarEmprendedor(form.nombre, form.email, form.contrasena);
      setSuccess(res.data);
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.message ?? 'Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-card rounded-2xl p-8 border border-border shadow-2xl text-center">
          <CheckCircle size={56} className="text-[var(--queparche-cyan)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">¡Cuenta creada!</h2>
          <p className="text-muted-foreground mb-6">
            <span className="text-[var(--queparche-violet)] font-semibold">{success.nombre}</span>, ya eres parte de QueParche.
          </p>
          <div className="bg-input-background rounded-lg p-4 text-left space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">ID: </span>
              <span className="text-[var(--queparche-cyan)] font-mono text-xs break-all">{success.id}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Email: </span>
              <span className="text-foreground">{success.email}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Rol: </span>
              <span className="text-[var(--queparche-violet)] font-semibold">{success.rol}</span>
            </p>
          </div>
          <button
            onClick={() => { setSuccess(null); setForm({ nombre: '', email: '', contrasena: '' }); }}
            className="mt-6 py-3 px-8 rounded-lg font-semibold bg-[var(--queparche-gray)] text-foreground hover:bg-[var(--queparche-gray-dark)] transition-colors"
          >
            Registrar otro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-violet)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[var(--queparche-magenta)]">
            Registro de Usuario (RF02)
          </h1>
          <p className="text-muted-foreground text-center">Únete a la comunidad de QueParche</p>
        </div>

        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-2xl">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-[var(--queparche-violet)]">Emprendedor</h2>
          </div>

          {error && (
            <div className="flex items-start gap-3 mb-5 p-4 bg-[var(--queparche-magenta)]/10 border border-[var(--queparche-magenta)]/30 rounded-lg">
              <AlertCircle size={18} className="text-[var(--queparche-magenta)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--queparche-magenta)]">{error}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Nombre Completo</label>
              <input
                name="nombre"
                type="text"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre completo"
                required
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-cyan)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Correo Electrónico</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="tucorreo@ejemplo.com"
                required
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-cyan)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Contraseña</label>
              <div className="relative">
                <input
                  name="contrasena"
                  type={showPassword ? 'text' : 'password'}
                  value={form.contrasena}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-12 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-cyan)] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-semibold text-lg bg-[var(--queparche-violet)] text-foreground hover:bg-[var(--queparche-violet-light)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              ¿Ya tienes una cuenta?{' '}
              <a href="#" className="text-[var(--queparche-cyan)] hover:text-[var(--queparche-cyan-dark)] font-semibold transition-colors">
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
