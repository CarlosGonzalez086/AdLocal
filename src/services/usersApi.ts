import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";

/* ============================
   Axios instance
============================ */
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/Usuarios`,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ============================
   Interceptors
============================ */
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

/* ============================
   DTOs
============================ */

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

export interface PaginatedResponse<T> {
  totalRecords: number;
  page: number;
  pageSize: number;
  data: T[];
}

/* ============================
   Service
============================ */

export const usersService = {
  /* Obtener usuarios con suscripción activa */
  getAll(params?: {
    page?: number;
    pageSize?: number;
    orderBy?: "recent" | "old" | "az" | "za";
    search?: string;
  }) {
    return api.get<ApiResponse<PaginatedResponse<UsuarioConSuscripcionDto>>>("", {
      params,
    });
  },

  /* Obtener usuario por id (si lo necesitas) */
  getById(id: number) {
    return api.get<UsuarioDto>(`/${id}`);
  },

  /* Eliminar usuario */
  eliminar(id: number) {
    return api.delete(`/${id}`);
  },
};
