/** Utilidades de fecha. La app es de Medellín: todo se muestra en hora de Colombia. */

const TZ = 'America/Bogota';

function claveDia(fecha: Date): string {
  // yyyy-mm-dd en la zona horaria de Bogotá
  return fecha.toLocaleDateString('en-CA', { timeZone: TZ });
}

/** "Hoy", "Mañana" o "vie 8 ago" */
export function etiquetaDia(iso: string): string {
  const fecha = new Date(iso);
  const hoy = claveDia(new Date());
  const manana = claveDia(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const dia = claveDia(fecha);
  if (dia === hoy) return 'Hoy';
  if (dia === manana) return 'Mañana';
  return fecha.toLocaleDateString('es-CO', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' });
}

/** "5:00 p. m." */
export function horaLocal(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-CO', { timeZone: TZ, hour: 'numeric', minute: '2-digit' });
}

/** "viernes, 8 de agosto, 5:00 p. m." */
export function fechaLarga(iso: string): string {
  const fecha = new Date(iso);
  const dia = fecha.toLocaleDateString('es-CO', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return `${dia}, ${horaLocal(iso)}`;
}

export function esPasado(iso: string): boolean {
  return new Date(iso).getTime() < Date.now();
}

/** ISO UTC → valor para <input type="datetime-local"> en hora local del navegador. */
export function isoAInputLocal(iso: string): string {
  const f = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${f.getFullYear()}-${pad(f.getMonth() + 1)}-${pad(f.getDate())}T${pad(f.getHours())}:${pad(f.getMinutes())}`;
}

/** Valor de <input type="datetime-local"> → ISO UTC. */
export function inputLocalAIso(valor: string): string {
  return new Date(valor).toISOString();
}

/** Mínimo del input datetime-local: ahora + 30 minutos. */
export function minimoInputLocal(): string {
  return isoAInputLocal(new Date(Date.now() + 30 * 60 * 1000).toISOString());
}
