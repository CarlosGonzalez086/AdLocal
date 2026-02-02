import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext ";
import type { AxiosInstance } from "axios";
import axios from "axios";

export interface ActualizarJwtParams {
  email: string;
  updateJWT: boolean;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  comercioId?: number;
}

export interface ActualizarJwtResponse {
  codigo: string;
  mensaje: string;
  respuesta: {
    token: string | null;
    usuario: Usuario;
  };
}

export const useActualizarJwt = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useContext(UserContext);

  const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (r) => r,
    (e) => {
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(e);
    },
  );

  const actualizarJwt = async (params: ActualizarJwtParams) => {
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("No hay usuario en contexto");

      const url =
        user.rol === "Admin"
          ? `${import.meta.env.VITE_API_URL}/Admin/actualizar-jwt`
          : `${import.meta.env.VITE_API_URL}/auth/actualizar-jwt`;

      const { data } = await api.post<ActualizarJwtResponse>(url, params);

      if (data.respuesta?.token) {
        localStorage.setItem("token", data.respuesta.token);
      }

      return data;
    } catch (err: any) {
      const mensaje =
        err?.response?.data?.mensaje ||
        err.message ||
        "Error al actualizar el JWT";
      setError(mensaje);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    actualizarJwt,
    loading,
    error,
  };
};
