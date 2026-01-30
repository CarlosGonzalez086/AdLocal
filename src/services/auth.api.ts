import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/Auth`,
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

export interface UserDto {
  id?: number;
  nombre: string;
  email: string;
  fotoUrl: string;
  fechaCreacion: string;
}

export interface NewPasswordDto {
  passwordNueva: string;
  codigo: string;
}

export interface EmailDto {
  email: string;
}

export interface JwtClaims {
  sub: string;
  id: string;
  nombre: string;
  rol: string;

  comercioId?: string;
  fotoUrl?: string;

  planId?: string;
  planTipo?: string;
  nivelVisibilidad?: string;

  maxNegocios?: string;
  maxProductos?: string;
  maxFotos?: number;

  esatdo?: string;
  codigoReferido: string;
  permiteCatalogo?: string;
  tieneAnalytics?: string;

  badge?: string;

  exp: number;
  iat: number;
}

export const defaultJwtClaims: JwtClaims = {
  sub: "",
  id: "",
  nombre: "",
  rol: "Colaborador", // rol más restrictivo por default

  comercioId: undefined,
  fotoUrl: "",

  planId: undefined,
  planTipo: "BASIC", // plan más bajo por default
  nivelVisibilidad: "0",

  maxNegocios: "0",
  maxProductos: "0",
  maxFotos: 0,

  esatdo: "inactive",
  codigoReferido: "",
  permiteCatalogo: "False",
  tieneAnalytics: "False",

  badge: "",

  exp: 0,
  iat: 0,
};

export const authApi = {
  forgetPassword: (data: EmailDto) =>
    api.post<ApiResponse<null>>("/forget-password", data),
  newPassword: (data: NewPasswordDto) =>
    api.post<ApiResponse<null>>("/new-password", data),
  checkToken: (token: string) =>
    api.post<ApiResponse<null>>("/check-token", null, {
      params: { token },
    }),
};
