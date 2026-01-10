import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/tarjetas`,
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

// DTOs
export interface CrearTarjetaDto {
  paymentMethodId: string;
  isDefault: boolean;
}

export interface TarjetaDto {
  id: number;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  cardType: string;
  nombre: string;
  numero: string;
  isDefault: boolean;
  stripePaymentMethodId: string;
}

export const tarjetaApi = {
  listar: () =>
    api.get<ApiResponse<TarjetaDto[]>>(""),

  crear: (data: CrearTarjetaDto) =>
    api.post<ApiResponse<TarjetaDto>>("", data),

  setDefault: (id: number) =>
    api.put<ApiResponse<null>>(`/${id}/default`),

  eliminar: (id: number) =>
    api.delete<ApiResponse<null>>(`/${id}`),
};
