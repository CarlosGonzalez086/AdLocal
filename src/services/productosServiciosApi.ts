import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/ProductosServicios`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

export interface ProductoServicioDto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  activo: boolean;
  stock: number;
  imagenBase64?: string;
}

export interface PagedResponse<T> {
  items: T[];
  totalItems: number;
}

export const productosServiciosApi = {
  crear: (data: ProductoServicioDto) =>
    api.post<ApiResponse<ProductoServicioDto>>("", data),

  actualizar: (id: number, data: ProductoServicioDto) =>
    api.put<ApiResponse<ProductoServicioDto>>(`/${id}`, data),

  eliminar: (id: number) => api.delete<ApiResponse<null>>(`/${id}`),

  desactivar: (id: number) => api.put<ApiResponse<null>>(`desactivar/${id}`),

  getById: (id: number) => api.get<ApiResponse<ProductoServicioDto>>(`/${id}`),

  getAllPaged: (params?: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    search?: string;
  }) =>
    api.get<ApiResponse<PagedResponse<ProductoServicioDto>>>("", { params }),

  getAllByComercio: (idComercio: number) =>
    api.get<ApiResponse<ProductoServicioDto[]>>(`/comercio/${idComercio}`),
};
