import axios from "axios";
import { extraerMensajeError } from "../utils/errorHandler";

const getAdminPublicoBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  const baseUrl = envUrl ? envUrl.replace(/\/+$/, "") : "https://adlocalapi.onrender.com";
  return `${baseUrl}/api/`;
};

export const httpAdminPublico = axios.create({
  baseURL: getAdminPublicoBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

httpAdminPublico.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && typeof error === "object") {
      (error as Record<string, unknown>).mensajeAmigable = extraerMensajeError(error);
    }
    return Promise.reject(error);
  },
);
