export interface ApiResponse<T> {
  codigo: string;
  mensaje: string;
  respuesta: T;
}
