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

  codigo: string | null;
  codigoReferido: string | null;

  comercioId: number | null;

  stripeCustomerId: string | null;
  token: string | null;

  redeemMonthFree: boolean;
  redeemRewards: boolean;

  fechaCreacion: string;
  fechaActualizacion: string | null;
  ultimoAcceso: string | null;

  comercios: unknown[];
  direcciones: unknown[];
  suscripciones: unknown[];
}
export interface UsuarioConSuscripcionDto {
  usuario: UsuarioDto;
  suscripcion: SuscripcionDto;
}
