import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  clearStorageAdmin,
  getLocalStorageJWTAdmin,
} from "../utils/storageAdmin";
import { renovarTokenAdmin } from "../services/tokenRefresh";

const getAdminBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  const baseUrl = envUrl ? envUrl.replace(/\/+$/, "") : "https://adlocalapi.onrender.com";
  return `${baseUrl}/api/`;
};

export const httpAdmin = axios.create({
  baseURL: getAdminBaseUrl(),
});

httpAdmin.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getLocalStorageJWTAdmin();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

interface RetryQueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshingAdmin = false;
let failedQueueAdmin: RetryQueueItem[] = [];

const processQueueAdmin = (error: unknown, token: string | null = null) => {
  failedQueueAdmin.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueueAdmin = [];
};

httpAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    const requestUrl = (originalRequest?.url || "").toLowerCase();
    const isAuthRequest =
      requestUrl.includes("renovar-token") ||
      requestUrl.includes("login") ||
      requestUrl.includes("forget-password") ||
      requestUrl.includes("new-password");

    // Manejar 401 renovando el token de administrador
    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshingAdmin) {
        return new Promise<string>((resolve, reject) => {
          failedQueueAdmin.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpAdmin(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshingAdmin = true;

      return new Promise((resolve, reject) => {
        renovarTokenAdmin()
          .then((res) => {
            const nuevoToken = res?.respuesta?.token;
            if (!nuevoToken) {
              throw new Error("No se recibió token renovado para admin");
            }
            processQueueAdmin(null, nuevoToken);
            originalRequest.headers.Authorization = `Bearer ${nuevoToken}`;
            resolve(httpAdmin(originalRequest));
          })
          .catch((refreshError) => {
            processQueueAdmin(refreshError, null);
            clearStorageAdmin();
            if (
              typeof window !== "undefined" &&
              !window.location.pathname.includes("/admin/login")
            ) {
              window.location.href = "/admin/login";
            }
            reject(refreshError);
          })
          .finally(() => {
            isRefreshingAdmin = false;
          });
      });
    }

    // 403 Forbidden o 401 no recuperable
    if (status === 403 || (status === 401 && isAuthRequest)) {
      clearStorageAdmin();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/admin/login")
      ) {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);
