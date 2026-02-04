import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/suscripciones`,
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
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export interface SuscripcionListadoDto {
  id: number;
  estado: string;

  fechaInicio: string | null;
  fechaFin: string | null;

  autoRenew: boolean;

  usuarioNombre: string;
  usuarioEmail: string;

  planNombre: string;
  planTipo: string;
  precio: number;
}

export interface PaginatedResponse<T> {
  totalRecords: number;
  page: number;
  pageSize: number;
  data: T[];
}

export const suscripcionesService = {
  getAll(params?: { page?: number; pageSize?: number }) {
    return api.get<ApiResponse<PaginatedResponse<SuscripcionListadoDto>>>("", {
      params,
    });
  },
};
