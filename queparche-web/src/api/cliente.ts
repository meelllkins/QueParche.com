/** Cliente HTTP mínimo con manejo uniforme de errores de la API. */

export class ErrorApi extends Error {
  constructor(
    public readonly status: number,
    public readonly codigo: string,
    mensaje: string,
    public readonly detalles?: { campo: string; mensaje: string }[],
  ) {
    super(mensaje);
    this.name = 'ErrorApi';
  }
}

async function pedir<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(ruta, init);
  } catch {
    throw new ErrorApi(0, 'SIN_CONEXION', 'No pudimos conectar con el servidor. ¿Está corriendo la API?');
  }

  if (respuesta.status === 204) return undefined as T;

  let cuerpo: unknown;
  try {
    cuerpo = await respuesta.json();
  } catch {
    throw new ErrorApi(respuesta.status, 'RESPUESTA_INVALIDA', 'El servidor devolvió una respuesta inesperada');
  }

  if (!respuesta.ok) {
    const err = cuerpo as { error?: string; message?: string; detalles?: { campo: string; mensaje: string }[] };
    throw new ErrorApi(
      respuesta.status,
      err.error ?? 'ERROR',
      err.message ?? 'Ocurrió un error inesperado',
      err.detalles,
    );
  }
  return cuerpo as T;
}

function cabeceras(actorId?: string): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (actorId) h['X-Usuario-Id'] = actorId;
  return h;
}

export const api = {
  get: <T>(ruta: string, actorId?: string) =>
    pedir<T>(ruta, { headers: actorId ? { 'X-Usuario-Id': actorId } : undefined }),

  post: <T>(ruta: string, cuerpo: unknown, actorId?: string) =>
    pedir<T>(ruta, { method: 'POST', headers: cabeceras(actorId), body: JSON.stringify(cuerpo) }),

  put: <T>(ruta: string, cuerpo: unknown, actorId?: string) =>
    pedir<T>(ruta, { method: 'PUT', headers: cabeceras(actorId), body: JSON.stringify(cuerpo) }),

  del: (ruta: string, actorId?: string) =>
    pedir<void>(ruta, { method: 'DELETE', headers: actorId ? { 'X-Usuario-Id': actorId } : undefined }),
};
