import React, { useState } from 'react';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { registrarEmprendedor, actualizarPerfil } from '../../services/api';
import type { ErrorResponse, UsuarioResponse } from '../../types/api';

// RF06 — Registro completo de emprendedor:
//   Paso 1 → POST /api/v1/usuarios/emprendedores (nombre, email, contrasena)
//   Paso 2 → PUT  /api/v1/usuarios/{uuid}/perfil  (telefono, redesSociales)
type FlowStep = 'idle' | 'registrando' | 'actualizando' | 'done';

export function RF06RegistroCompleto() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [flowStep, setFlowStep] = useState<FlowStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<UsuarioResponse | null>(null);

  const [form, setForm] = useState({
    nombre: '',
    cedula: '',
    email: '',
    telefono: '',
    nombreNegocio: '',
    anosExperiencia: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.contrasena !== form.confirmarContrasena) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }

    setError(null);

    try {
      // Paso 1 — crear cuenta base de emprendedor
      setFlowStep('registrando');
      const regRes = await registrarEmprendedor(form.nombre, form.email, form.contrasena);
      const uuid = regRes.data.id;

      // Paso 2 — enriquecer perfil con teléfono
      setFlowStep('actualizando');
      const perfilRes = await actualizarPerfil(uuid, form.telefono, null, {});

      setSuccess(perfilRes.data);
      setFlowStep('done');
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.message ?? 'Error inesperado. Intenta de nuevo.');
      setFlowStep('idle');
    }
  };

  const isLoading = flowStep === 'registrando' || flowStep === 'actualizando';

  if (flowStep === 'done' && success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md bg-card rounded-2xl p-8 border border-border shadow-2xl text-center">
          <CheckCircle size={56} className="text-[var(--queparche-cyan)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">¡Registro completo!</h2>
          <p className="text-muted-foreground mb-6">
            Bienvenido,{' '}
            <span className="text-[var(--queparche-violet)] font-semibold">{success.nombre}</span>.
            Tu perfil de emprendedor está listo.
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
        </div>
      </div>
    );
  }

  const stepLabel =
    flowStep === 'registrando' ? 'Creando cuenta...' :
    flowStep === 'actualizando' ? 'Guardando perfil...' : '';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-violet)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--queparche-gray)]"></div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 text-[var(--queparche-violet)]">
            Formulario de Datos Personales (RF06)
          </h1>
          <p className="text-muted-foreground text-center">Crea tu perfil de emprendedor en QueParche</p>
        </div>

        <div className="bg-card rounded-2xl p-6 md:p-8 border border-border shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Datos Personales</h2>

          {error && (
            <div className="flex items-start gap-3 mb-5 p-4 bg-[var(--queparche-magenta)]/10 border border-[var(--queparche-magenta)]/30 rounded-lg">
              <AlertCircle size={18} className="text-[var(--queparche-magenta)] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--queparche-magenta)]">{error}</p>
            </div>
          )}

          {isLoading && (
            <div className="flex items-center gap-3 mb-5 p-4 bg-[var(--queparche-violet)]/10 border border-[var(--queparche-violet)]/30 rounded-lg">
              <div className="w-4 h-4 border-2 border-[var(--queparche-violet)] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <p className="text-sm text-[var(--queparche-violet)]">{stepLabel}</p>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Nombre Completo</label>
              <input
                name="nombre" type="text" value={form.nombre} onChange={handleChange}
                placeholder="Ingresa tu nombre completo" required
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Número de cédula</label>
              <input
                name="cedula" type="text" value={form.cedula} onChange={handleChange}
                placeholder="1234567890"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Correo electrónico</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="tucorreo@ejemplo.com" required
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Número de celular</label>
              <input
                name="telefono" type="tel" value={form.telefono} onChange={handleChange}
                placeholder="+57 300 123 4567" required
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Nombre de tu Parche/Negocio</label>
              <input
                name="nombreNegocio" type="text" value={form.nombreNegocio} onChange={handleChange}
                placeholder="El Buen Sabor"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Años de experiencia</label>
              <input
                name="anosExperiencia" type="number" value={form.anosExperiencia} onChange={handleChange}
                placeholder="0" min="0" max="50"
                className="w-full px-4 py-3 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Contraseña</label>
              <div className="relative">
                <input
                  name="contrasena" type={showPassword ? 'text' : 'password'} value={form.contrasena}
                  onChange={handleChange} placeholder="••••••••" required
                  className="w-full px-4 py-3 pr-12 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">Confirmar contraseña</label>
              <div className="relative">
                <input
                  name="confirmarContrasena" type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmarContrasena} onChange={handleChange} placeholder="••••••••" required
                  className="w-full px-4 py-3 pr-12 bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--queparche-violet)] focus:border-transparent transition-all"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox" id="terms" checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border bg-input-background text-[var(--queparche-violet)] focus:ring-2 focus:ring-[var(--queparche-violet)] cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                Acepta Términos y Condiciones
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-lg font-semibold text-lg bg-[var(--queparche-violet)] text-foreground hover:bg-[var(--queparche-violet-light)] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? stepLabel : 'Finalizar registro'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
