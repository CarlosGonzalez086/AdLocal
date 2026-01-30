import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/Suscripciones`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

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
  isMultiUsuario:boolean;

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
}

export const suscripcionApi = {
  contratar: (data: SuscripcionCreateDto) =>
    api.post<ApiResponse<null>>("/crear", data),

  miSuscripcion: () =>
    api.get<ApiResponse<SuscripcionDto>>("/mi-suscripcion"),

  cancelar: () =>
    api.post<ApiResponse<null>>("/cancelar"),
};
