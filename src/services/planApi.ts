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

export interface PlanCreateDto {
  id?: number;
  nombre: string;
  precio: number;
  duracionDias: number;
  tipo: string;
}

export const planApi = {
  getAll: () => api.get(""),
  getById: (id: number) => api.get(`/${id}`),
  crear: (data: PlanCreateDto) => api.post("", data),
  actualizar: (id: number, data: PlanCreateDto) => api.put(`/${id}`, data),
  eliminar: (id: number) => api.delete(`/${id}`),
};
