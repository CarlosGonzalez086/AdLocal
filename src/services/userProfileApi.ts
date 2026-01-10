import axios from "axios";
import type { ApiResponse } from "../api/apiResponse";


const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
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

export interface ProfileUser {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  comercioId: number | null;
  fechaCreacion: string;
  activo: boolean;
  fotoUrl: string;
}

export interface ProfileUserUpdateDto {
  nombre: string;
  email: string;
  password?: string;
  comercioId?: number;
}

export interface ChangeUserPasswordDto {
  passwordActual: string;
  passwordNueva: string;
}

export const initialProfile: ProfileUser = {
  id: 0,
  nombre: "",
  email: "",
  rol: "",
  comercioId: null,
  fechaCreacion: "",
  activo: false,
  fotoUrl: "",
};

export const profileUserApi = {
  getProfile: () =>
    api.get<ApiResponse<ProfileUser>>("/Auth"),

  updateProfile: (data: ProfileUserUpdateDto) =>
    api.put<ApiResponse<ProfileUser>>("/Auth", data),

  changePassword: (data: ChangeUserPasswordDto) =>
    api.put<ApiResponse<null>>("/Auth/cambiar-password", data),

  uploadPhoto: (base64Data: { base64: string }) =>
    api.post<ApiResponse<{ url: string }>>(
      "/Auth/upload-photo",
      base64Data
    ),
};
