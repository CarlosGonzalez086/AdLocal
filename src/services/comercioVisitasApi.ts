import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/ComercioVisitas`,
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

    const message =
      error.response?.data?.mensaje ||
      error.response?.data?.message ||
      "Error en la petición";

    throw new Error(message);
  },
);

export interface VisitasPorDiaDto {
  dia: string;
  total: number;
}

export interface VisitasPorMesDto {
  mes: string;
  total: number;
}

export interface ComercioVisitasStatsDto {
  ultimaSemana: VisitasPorDiaDto[];
  ultimosTresMeses: VisitasPorMesDto[];
}


export const comercioVisitasApi = {
  getStats: (comercioId: number) =>
    api.get<ApiResponse<ComercioVisitasStatsDto>>(`/${comercioId}/stats`),
};
