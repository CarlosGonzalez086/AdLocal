import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/tarjetas`,
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

// DTOs actualizados
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
  StripePaymentMethodId:string;
}

export const tarjetaApi = {
  listar: () => api.get(""),
  crear: (data: CrearTarjetaDto) => api.post("", data),
  setDefault: (id: number) => api.put(`/${id}/default`),
  eliminar: (id: number) => api.delete(`/${id}`),
};
