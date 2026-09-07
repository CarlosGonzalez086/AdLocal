import axios from "axios";
import { extraerMensajeError } from "../utils/errorHandler";

export const httpUsuarioPublico = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}api/`,
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
