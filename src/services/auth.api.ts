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
