import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";

export interface SuscripcionCreateDto {
  planId: number;
  stripePaymentMethodId: string;
}

export interface PlanDto {
  nombre: string;
  precio: number;
  duracionDias: number;
  tipo: string;

  maxNegocios: number;
  maxProductos: number;
  maxFotos: number;

  nivelVisibilidad: number;
  permiteCatalogo: boolean;
  coloresPersonalizados: boolean;
  isMultiUsuario: boolean;

  tieneBadge: boolean;
  badgeTexto?: string;
  tieneAnalytics: boolean;
}

export interface SuscripcionDto {
  id: number;

  plan: PlanDto;

  monto: number;
  moneda: string;

  fechaInicio: string;
  fechaFin: string;

  estado: string;
  activa: boolean;
  autoRenew: boolean;
}

export const defaultPlan: PlanDto = {
  nombre: "FREE",
  precio: 0,
  duracionDias: 0,
  tipo: "FREE",

  maxNegocios: 0,
  maxProductos: 0,
  maxFotos: 0,

  nivelVisibilidad: 0,
  permiteCatalogo: false,
  coloresPersonalizados: false,
  isMultiUsuario: false,

  tieneBadge: false,
  badgeTexto: "",
  tieneAnalytics: false,
};
export const defaultSuscripcion: SuscripcionDto = {
  id: 0,

  plan: defaultPlan,

  monto: 0,
  moneda: "MXN",

  fechaInicio: "",
  fechaFin: "",

  estado: "FREE",
  activa: false,
  autoRenew: false,
};

export const suscripcionApi = {
  contratar: (data: SuscripcionCreateDto) =>
    httpUsuario.post<ApiResponse<null>>("/Suscripciones/crear", data),

  miSuscripcion: () =>
    httpUsuario.get<ApiResponse<SuscripcionDto>>(
      "/Suscripciones/mi-suscripcion",
    ),

  cancelar: () =>
    httpUsuario.post<ApiResponse<null>>("/Suscripciones/cancelar"),
};
