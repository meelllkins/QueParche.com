/**
 * Errores de dominio/aplicación con código HTTP y código interno.
 * El manejador central de Express los convierte en JSON uniforme:
 *   { error: CODIGO, message: '...' }
 */
export class ErrorApp extends Error {
  constructor(
    public readonly status: number,
    public readonly codigo: string,
    mensaje: string,
  ) {
    super(mensaje);
    this.name = 'ErrorApp';
  }
}

export const noEncontrado = (mensaje: string) => new ErrorApp(404, 'NO_ENCONTRADO', mensaje);
export const accesoDenegado = (mensaje: string) => new ErrorApp(403, 'ACCESO_DENEGADO', mensaje);
export const noAutenticado = (mensaje: string) => new ErrorApp(401, 'NO_AUTENTICADO', mensaje);
export const peticionInvalida = (mensaje: string) => new ErrorApp(400, 'PETICION_INVALIDA', mensaje);
