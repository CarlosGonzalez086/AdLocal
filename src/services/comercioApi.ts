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
  },
);

export interface HorarioComercioDto {
  dia: number;
  abierto: boolean;
  horaApertura?: string | null;
  horaCierre?: string | null;
}

export interface ComercioCreateDto {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  descripcion?: string;
  logoBase64?: string;
  imagenes?: string[];
  lat: number;
  lng: number;
  colorPrimario?: string;
  colorSecundario?: string;
  activo?: boolean;
  horarios?: HorarioComercioDto[];
  estadoId?: number;
  municipioId?: number;
}

export interface ComercioUpdateDto {
  nombre?: string | null;
  direccion?: string | null;
  telefono?: string | null;
  email?: string | null;
  descripcion?: string | null;
  logoBase64?: string | null;
  imagenes?: string[] | null;
  lat?: number | null;
  lng?: number | null;
  colorPrimario?: string | null;
  colorSecundario?: string | null;
  activo?: boolean | null;
  horarios?: HorarioComercioDto[] | null;
  estadoId?: number | null;
  municipioId?: number | null;
}

export interface ComercioDto {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  descripcion: string;
  logoBase64: string;
  imagenes: string[];
  lat: number;
  lng: number;
  colorPrimario: string;
  colorSecundario: string;
  activo: boolean;
  horarios: HorarioComercioDto[];
  estadoId: number;
  municipioId: number;
  estadoNombre: string;
  municipioNombre: string;
}

export const comercioApi = {
  getMine: () => api.get<ApiResponse<ComercioDto>>("/mine"),

  crear: (data: ComercioCreateDto) =>
    api.post<ApiResponse<ComercioDto>>("", data),

  actualizar: (data: ComercioUpdateDto) =>
    api.put<ApiResponse<ComercioDto>>("", data),

  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/${id}`),
};
