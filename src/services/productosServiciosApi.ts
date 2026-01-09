import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/ProductosServicios`,
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

export interface ProductoServicioDto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio?: number;
  activo?: boolean;
}

export type ProductoServicioFormErrors = Partial<
  Record<keyof ProductoServicioDto, string>
>;

export const productosServiciosApi = {
  crear: (data: ProductoServicioDto) => api.post("", data),

  actualizar: (id: number, data: ProductoServicioDto) =>
    api.put(`/${id}`, data),

  eliminar: (id: number) => api.delete(`/${id}`),

  desactivar: (id: number) => api.patch(`desactivar/${id}`),

  getById: (id: number) => api.get(`/${id}`),

  getAllPaged: (params?: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    search?: string;
  }) => api.get("", { params }),

  getAllByComercio: (idComercio: number) => api.get(`/${idComercio}`),
};
