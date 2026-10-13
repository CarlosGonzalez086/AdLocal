export interface PlanDto {
  id: number;
  nombre: string;
  tipo: "FREE" | "BASIC" | "PRO" | "BUSINESS";
  precio: number;
  maxFotos: number;
}

export interface SuscripcionDto {
  id: number;
  status: "active" | "canceling" | "canceled";
  currentPeriodStart: string;
  currentPeriodEnd: string;
  autoRenew: boolean;
  plan: PlanDto;
}

export interface UsuarioDto {
  id: number;
  uuid: string;

  nombre: string;
  email: string;
  telefono: string | null;
  fotoUrl: string | null;

  rol: string;
  activo: boolean;
  emailVerificado: boolean;

  codigoReferido: string | null;

  comercioId: number | null;

  redeemMonthFree: boolean;
  redeemRewards: boolean;

  fechaCreacion: string;
  fechaActualizacion: string | null;
  ultimoAcceso: string | null;
}
export interface UsuarioConSuscripcionDto {
  usuario: UsuarioDto;
  suscripcion: SuscripcionDto;
}
