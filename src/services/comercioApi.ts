import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/comercios`,
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

export interface ComercioCreateDto {
  nombre: string;
  direccion?: string;
  telefono?: string;
  lat: number;
  lng: number;
  LogoBase64?: string;
}

export interface ComercioUpdateDto {
  nombre: string;
  direccion?: string;
  telefono?: string;
  activo: boolean;
  lat?: number;
  lng?: number;
  LogoBase64?: string;
}

export interface ComercioDto {
  id: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  activo: boolean;
  logoBase64?: string;
  ubicacion?: {
    x: number;
    y: number;
  } | null;
  lat: number;
  lng: number;
}

export const comercioApi = {
  getMine: () =>
    api.get<ApiResponse<ComercioDto>>("/mine"),

  crear: (data: ComercioCreateDto) =>
    api.post<ApiResponse<ComercioDto>>("", data),

  actualizar: (id: number, data: ComercioUpdateDto) =>
    api.put<ApiResponse<ComercioDto>>(`/${id}`, data),

  eliminar: (id: number) =>
    api.delete<ApiResponse<null>>(`/${id}`),
};
