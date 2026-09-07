import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  clearStorageUsuario,
  getLocalStorageJWTUsuario,
} from "../utils/storageUsuario";
import { renovarTokenUsuario } from "../services/tokenRefresh";
import { extraerMensajeError } from "../utils/errorHandler";

export const httpUsuario = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/`,
  withCredentials: true,
});

httpUsuario.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getLocalStorageJWTUsuario();

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

let isRefreshing = false;
let failedQueue: RetryQueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

httpUsuario.interceptors.response.use(
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

    // Manejar 401 mediante renovación transparente de token
    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthRequest) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return httpUsuario(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        renovarTokenUsuario()
          .then((res) => {
            const nuevoToken = res?.respuesta?.token;
            if (!nuevoToken) {
              throw new Error("No se recibió token renovado");
            }
            processQueue(null, nuevoToken);
            originalRequest.headers.Authorization = `Bearer ${nuevoToken}`;
            resolve(httpUsuario(originalRequest));
          })
          .catch((refreshError) => {
            processQueue(refreshError, null);
            clearStorageUsuario();
            if (
              typeof window !== "undefined" &&
              !window.location.pathname.includes("/usuario/login")
            ) {
              window.location.href = "/usuario/login";
            }
            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    // 403 Forbidden o 401 no recuperable
    if (status === 403 || (status === 401 && isAuthRequest)) {
      clearStorageUsuario();
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/usuario/login")
      ) {
        window.location.href = "/usuario/login";
      }
    }

    if (error && typeof error === "object") {
      (error as Record<string, unknown>).mensajeAmigable = extraerMensajeError(error);
    }

    return Promise.reject(error);
  },
);
