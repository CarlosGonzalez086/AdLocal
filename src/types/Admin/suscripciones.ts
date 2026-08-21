export interface SuscripcionListadoDto {
  id: number;
  estado: string;

  fechaInicio: string | null;
  fechaFin: string | null;

  autoRenew: boolean;

  usuarioNombre: string;
  usuarioEmail: string;

  planNombre: string;
  planTipo: string;
  precio: number;
}
