import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext ";
import { httpAdmin } from "../api/httpAdmin";
import { httpUsuario } from "../api/httpUsuario";
import { setLocalStorageJWTAdmin } from "../utils/storageAdmin";
import { setLocalStorageJWTUsuario } from "../utils/storageUsuario";

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

  const actualizarJwt = async (params: ActualizarJwtParams) => {
    setLoading(true);
    setError(null);

    try {
      if (!user) throw new Error("No hay usuario en contexto");

      const url =
        user.rol === "Admin"
          ? `${import.meta.env.VITE_API_URL}/Admin/actualizar-jwt`
          : `${import.meta.env.VITE_API_URL}/auth/actualizar-jwt`;

      const api = user.rol === "Admin" ? httpAdmin : httpUsuario;

      const { data } = await api.post<ActualizarJwtResponse>(url, params);

      if (data.respuesta?.token) {
        const isAdmin = user.rol === "Admin";
        if (isAdmin) {
          setLocalStorageJWTAdmin(data.respuesta?.token);
        } else {
          setLocalStorageJWTUsuario(data.respuesta?.token);
        }
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
