/** Contratos de la API — espejo exacto de lo que sirve el backend. */

export type Rol = 'CLIENTE' | 'EMPRENDEDOR';

export interface EmprendedorResumen {
  id: string;
  nombre: string;
  especialidad: string | null;
}

export interface EmprendedorPublico extends EmprendedorResumen {
  descripcion: string | null;
  telefono: string | null;
  correoSecundario: string | null;
  redesSociales: Record<string, string>;
}

export interface EmprendedorDirectorio extends EmprendedorPublico {
  totalServicios: number;
  proximaFecha: string | null;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  fechaHora: string;
  latitud: number;
  longitud: number;
  direccion: string;
  emprendedorId: string;
  createdAt: string;
}

export interface ServicioConEmprendedor extends Servicio {
  emprendedor: EmprendedorResumen;
}

export interface ServicioDetalle extends Servicio {
  emprendedor: EmprendedorPublico;
}

export interface PerfilEmprendedorCompleto extends EmprendedorPublico {
  servicios: Servicio[];
}

export interface UsuarioPropio {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  telefono: string | null;
  correoSecundario: string | null;
  redesSociales: Record<string, string>;
  especialidad: string | null;
  descripcion: string | null;
}

export interface ResultadoGeocodificacion {
  nombre: string;
  latitud: number;
  longitud: number;
}

export interface DatosServicioEnvio {
  nombre: string;
  descripcion: string;
  fechaHora: string;
  latitud: number;
  longitud: number;
  direccion: string;
}

export interface DatosPerfilEnvio {
  nombre: string;
  especialidad: string;
  descripcion: string;
  telefono: string;
  correoSecundario: string;
  redesSociales: Record<string, string>;
}
