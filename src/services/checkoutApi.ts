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
  }
);

export interface CheckoutResponseDto {
  url?: string;
}

export interface SimpleResponse {
  message?: string;
}

export const checkoutApi = {
  /**
   * Tarjeta guardada
   */
  suscribirseConTarjetaGuardada: (
    planId: number,
    stripePaymentMethodId: string,
    autoRenew: boolean
  ) =>
    api.post<ApiResponse<SimpleResponse>>("/suscribirse", {
      planId,
      stripePaymentMethodId,
      autoRenew,
    }),

  /**
   * Tarjeta nueva (Stripe Checkout)
   */
  crearCheckoutStripe: (planId: number) =>
    api.post<ApiResponse<CheckoutResponseDto>>("/checkout", {
      planId,
    }),

  /**
   * Cancelar suscripción
   */
  cancelarPlan: () =>
    api.post<ApiResponse<SimpleResponse>>("/cancelar"),
};
