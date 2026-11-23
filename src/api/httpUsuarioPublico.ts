import axios from "axios";
import { extraerMensajeError } from "../utils/errorHandler";

const getUsuarioPublicBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  const baseUrl = envUrl ? envUrl.replace(/\/+$/, "") : "https://adlocalapi.onrender.com";
  return `${baseUrl}/api/`;
};

export const httpUsuarioPublico = axios.create({
  baseURL: getUsuarioPublicBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

httpUsuarioPublico.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error && typeof error === "object") {
      (error as Record<string, unknown>).mensajeAmigable = extraerMensajeError(error);
    }
    return Promise.reject(error);
  },
);
