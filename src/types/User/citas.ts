export const EstadoCita = { Pendiente: 1, Confirmada: 2, EnAtencion: 3, Completada: 4, Cancelada: 5, NoAsistio: 6 } as const;
export type EstadoCita = typeof EstadoCita[keyof typeof EstadoCita];
export interface CitaDto { uuid: string; comercio: string; servicio: string; cliente: string; nombrePersona: string; telefonoCliente?: string; notasCliente?: string; nombreAtiende?: string; fechaInicio: string; fechaFin: string; estado: EstadoCita; }
