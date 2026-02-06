import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/TiposComercio`,
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

export interface TipoComercioCreateDto {
  id?: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export interface TipoComercioDto {
  id: number;
  nombre: string;
  descripcion?: string | null;
  activo: boolean;
}

export const tipoComercioApi = {
  getAllPaged: (page = 1, pageSize = 10, orderBy = "recent", search = "") =>
    api.get<ApiResponse<{ items: TipoComercioDto[]; totalItems: number }>>(
      `/getAllPaged?page=${page}&pageSize=${pageSize}&orderBy=${orderBy}&search=${search}`,
    ),

  getById: (id: number) => api.get<ApiResponse<TipoComercioDto>>(`/${id}`),

  crear: (data: TipoComercioCreateDto) =>
    api.post<ApiResponse<TipoComercioDto>>("", data),

  actualizar: (id: number, data: TipoComercioCreateDto) =>
    api.put<ApiResponse<TipoComercioDto>>(`/${id}`, data),

  eliminar: (id: number) => api.delete<ApiResponse<boolean>>(`/${id}`),
  getAllForSelect: () =>
    api.get<ApiResponse<TipoComercioDto[]>>(`/getAllForSelect`),
};
