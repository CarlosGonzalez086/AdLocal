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
  nombre: string;
  email: string;
  fotoUrl: string | null;
  fechaCreacion: string;
}

export interface UsuarioConSuscripcionDto {
  usuario: UsuarioDto;
  suscripcion: SuscripcionDto;
}