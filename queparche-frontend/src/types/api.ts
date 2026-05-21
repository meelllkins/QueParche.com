export interface BaseResponse<T> {
  timestamp: string;
  status: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface UsuarioResponse {
  id: string;
  nombre: string;
  email: string;
  rol: 'CLIENTE' | 'EMPRENDEDOR';
}

export interface ServicioResponse {
  id: string;
  nombre: string;
  descripcion: string;
  fechaHora: string;
  latitud: number;
  longitud: number;
  direccion: string;
  emprendedorId: string;
}
