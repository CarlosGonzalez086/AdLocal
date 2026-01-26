// services/checkoutApi.ts
import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/checkout`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(e);
  },
);

export interface CheckoutRequestDto {
  planId: number;
  metodo: "guardada" | "nueva" | "transferencia";
  stripePaymentMethodId?: string;
  autoRenew?:boolean;
}

export interface CheckoutResponseDto {
  url?: string;
  paymentIntentId?: string;
  referencia?: string;
}

export interface CambiarPlanDto {
  planIdNuevo: number;
  metodo: "guardada" | "nueva" | "transferencia";
  stripePaymentMethodId?: string;
}

export interface SimpleResponse {
  message?: string;
}

export const checkoutApi = {
  crearSesion: (dto: CheckoutRequestDto) =>
    api.post<ApiResponse<CheckoutResponseDto>>("/crearSesion", dto),

  contratarConTarjetaGuardada: (
    planId: number,
    stripePaymentMethodId: string,
  ) =>
    api.post<ApiResponse<CheckoutResponseDto>>("/crearSesion", {
      planId,
      metodo: "guardada",
      stripePaymentMethodId: stripePaymentMethodId,
    }),

  crearSesionStripe: (planId: number) =>
    api.post<ApiResponse<CheckoutResponseDto>>("/crearSesion", {
      planId,
      metodo: "nueva",
    }),

  generarReferenciaTransferencia: (planId: number, banco: string) =>
    api.post<ApiResponse<CheckoutResponseDto>>("/crearSesion", {
      planId,
      metodo: "transferencia",
      banco: banco,
    }),

  cancelarPlan: () => api.post<ApiResponse<SimpleResponse>>("/cancelar"),

  cambiarPlan: (dto: CambiarPlanDto) =>
    api.post<ApiResponse<CheckoutResponseDto>>("/cambiar-plan", dto),
};
