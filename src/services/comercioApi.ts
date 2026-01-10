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
  email?: string;
  descripcion?: string;

  // 🖼️ Logo principal (base64 o url)
  logoBase64?: string;

  // 🖼️ Galería de imágenes
  imagenes?: string[];

  lat: number;
  lng: number;

  // 🎨 Colores
  colorPrimario?: string;
  colorSecundario?: string;

  activo?: boolean;
}

export interface ComercioUpdateDto {
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  descripcion?: string;

  logoBase64?: string;
  imagenes?: string[];

  lat?: number;
  lng?: number;

  colorPrimario?: string;
  colorSecundario?: string;

  activo: boolean;
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
