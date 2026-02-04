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


export interface SuscripcionPorPlanDto {
  plan: string;
  tipo: "FREE" | "BASIC" | "PRO" | "BUSINESS";
  total: number;
}

export interface SuscripcionDashboardDto {
  porPlan: SuscripcionPorPlanDto[];
  ultimaSemana: number;
  ultimosTresMeses: number;
}



export const dashboardService = {
  getSuscripcionesStats() {
    return api.get<ApiResponse<SuscripcionDashboardDto>>("/suscripciones-stats");
  },
};
