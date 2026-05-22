import type { BaseResponse, ErrorResponse, UsuarioResponse, ServicioResponse } from '../types/api';

const BASE_URL = 'http://localhost:8080/api/v1';

async function apiFetch<T>(path: string, options: RequestInit): Promise<BaseResponse<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await res.json();
  if (!res.ok) throw body as ErrorResponse;
  return body as BaseResponse<T>;
}

// RF02 — Registro simple de cliente
export async function registrarCliente(
  nombre: string,
  email: string,
  contrasena: string
): Promise<BaseResponse<UsuarioResponse>> {
  return apiFetch<UsuarioResponse>('/usuarios/clientes', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, contrasena }),
  });
}

// RF06 — Registro de emprendedor (paso 1 del flujo de 2 pasos)
export async function registrarEmprendedor(
  nombre: string,
  email: string,
  contrasena: string
): Promise<BaseResponse<UsuarioResponse>> {
  return apiFetch<UsuarioResponse>('/usuarios/emprendedores', {
    method: 'POST',
    body: JSON.stringify({ nombre, email, contrasena }),
  });
}

// RF03 & RF07 — Actualización de perfil (paso 2 del flujo RF06)
export async function actualizarPerfil(
  uuid: string,
  telefono: string,
  correoSecundario: string | null,
  redesSociales: Record<string, string>
): Promise<BaseResponse<UsuarioResponse>> {
  return apiFetch<UsuarioResponse>(`/usuarios/${uuid}/perfil`, {
    method: 'PUT',
    body: JSON.stringify({ telefono, correoSecundario, redesSociales }),
  });
}

// RF10 — Publicación de información del servicio
export async function crearServicio(payload: {
  emprendedorId: string;
  nombre: string;
  descripcion: string;
  fechaHora: string;
  latitud: number;
  longitud: number;
  direccion: string;
}): Promise<BaseResponse<ServicioResponse>> {
  return apiFetch<ServicioResponse>('/servicios', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
