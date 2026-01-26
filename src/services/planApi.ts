import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/planes`,
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

export interface PlanCreateDto {
  id?: number;

  // Básico
  nombre: string;
  precio: number;
  duracionDias: number;
  tipo: "FREE" | "BASIC" | "PRO" | "BUSINESS";

  // Capacidades
  maxNegocios: number;
  maxProductos: number;
  maxFotos: number;

  // Features
  nivelVisibilidad: number; // 0 - 100
  permiteCatalogo: boolean;
  coloresPersonalizados: boolean;
  tieneBadge: boolean;
  badgeTexto?: string | null;
  tieneAnalytics: boolean;
}

export type PlanFormErrors = Partial<Record<keyof PlanCreateDto, string>>;

export const planApi = {
  getAll: (params?: {
    page?: number;
    pageSize?: number;
    orderBy?: string;
    search?: string;
  }) => api.get("", { params }),

  getAllPlanesUser: () => api.get("/AllPlanesUser"),

  getById: (id: number) => api.get(`/${id}`),

  crear: (data: PlanCreateDto) => api.post("", data),

  actualizar: (id: number, data: PlanCreateDto) => api.put(`/${id}`, data),

  eliminar: (id: number) => api.delete(`/${id}`),
};
