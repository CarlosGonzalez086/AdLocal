import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";
import type { PagedResponse } from "./productosServiciosApi";
import type { ProfileUser } from "./userProfileApi";

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
  horaAperturaFormateada?: string;
  horaCierreFormateada?: string;
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
  id: number;
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
  promedioCalificacion: number;
  calificacion?: number;
  badge?: string;
  tipoComercioId: number;
}

export const comercioDtoDefault: ComercioDto = {
  id: 0,
  nombre: "",
  direccion: "",
  telefono: "",
  email: "",
  descripcion: "",
  logoBase64: "",
  imagenes: [],
  lat: 19.4326,
  lng: -99.1332,
  colorPrimario: "#007AFF",
  colorSecundario: "#FF9500",
  activo: true,
  horarios: [],
  estadoId: 0,
  municipioId: 0,
  estadoNombre: "",
  municipioNombre: "",
  promedioCalificacion: 0,
  tipoComercioId: 0,
};

export interface ComercioDtoListItem {
  id: number;
  nombre: string;
  idUsuario: number;
  descripcion?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  logoUrl?: string;
  lat?: number;
  lng?: number;
  colorPrimario?: string;
  colorSecundario?: string;
  activo: boolean;
  fechaCreacion: string;
  estadoNombre: string;
  municipioNombre: string;
  promedioCalificacion: number;
  badge: string;
}

export interface ColaborarDto {
  idComercio: number;
  nombre: string;
  correo: string;
}

export const comercioApi = {
  getMine: () => api.get<ApiResponse<ComercioDto>>("/mine"),
  getTotalComerciosByIdUsuario: () =>
    api.get<ApiResponse<object>>("/getTotalComerciosByIdUsuario"),

  crear: (data: ComercioCreateDto) =>
    api.post<ApiResponse<ComercioDto>>("", data),

  actualizar: (data: ComercioUpdateDto) =>
    api.put<ApiResponse<ComercioDto>>("", data),

  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/${id}`),
  getAllComerciosByUser: (page = 1, pageSize = 10) =>
    api.get<ApiResponse<PagedResponse<ComercioDtoListItem>>>(
      "/getAllComerciosByUser",
      {
        params: { page, pageSize },
      },
    ),
  getById: (id: number) => api.get<ApiResponse<ComercioDto>>(`/${id}`),
  guardarColaborador: (data: ColaborarDto) =>
    api.post<ApiResponse<object>>("/guardarColaborador", data),
  getAllColaboradores: (idComercio = 0, page = 1, pageSize = 10) =>
    api.get<ApiResponse<PagedResponse<ProfileUser>>>("/getAllColaboradores", {
      params: { idComercio, page, pageSize },
    }),
  toggleAccesoColaborador: (idColaborador: number, idComercio: number) =>
    api.put<ApiResponse<object>>(`toggleAccesoColaborador`, null, {
      params: {
        idColaborador,
        idComercio,
      },
    }),
  eliminarColaborador: (idColaborador: number, idComercio: number) =>
    api.delete<ApiResponse<object>>(`eliminarColaborador`, {
      params: {
        idColaborador,
        idComercio,
      },
    }),
};
