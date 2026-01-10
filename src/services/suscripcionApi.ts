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

export interface SuscripcionDto {
  id: number;
  planId: number;
  plan: string;
  monto: number;
  moneda: string;
  tipo: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  activa: boolean;
  autoRenovacion: boolean;
}

export const suscripcionApi = {
  contratar: (data: SuscripcionCreateDto) =>
    api.post<ApiResponse<null>>("", data),

  miSuscripcion: () =>
    api.get<ApiResponse<SuscripcionDto>>("/mi-suscripcion"),

  cancelar: () =>
    api.post<ApiResponse<null>>("/cancelar"),
};
