export interface Notificacion {
  uuid: string;
  titulo: string;
  mensaje: string;
  tipoNotificacion: number;
  pedidoUuid?: string | null;
  url?: string | null;
  leida: boolean;
  fechaCreacion: string;
}

export interface ResumenNotificaciones {
  noLeidas: number;
  notificaciones: Notificacion[];
}
