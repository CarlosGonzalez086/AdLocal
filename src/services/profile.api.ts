import axios from "axios";
import type {
  ChangePasswordDto,
  Profile,
  ProfileUpdateDto,
} from "../pages/profile/profile.types";

interface ApiResponse<T> {
  codigo: string;
  mensaje: string;
  respuesta: T;
}

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
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

/* =========================
   RESPONSE INTERCEPTOR
========================= */
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

/* =========================
   PROFILE API
========================= */
export const profileApi = {
  getProfile: () => api.get<ApiResponse<Profile>>("/Admin"),
  updateProfile: (data: ProfileUpdateDto) => api.put("/Admin", data),
  changePassword: (data: ChangePasswordDto) =>
    api.put("/Admin/cambiar-password", data),
};
