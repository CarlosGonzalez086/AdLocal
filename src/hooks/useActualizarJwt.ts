import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { httpAdmin } from "../api/httpAdmin";
import { httpUsuario } from "../api/httpUsuario";
import {
  getLocalStorageJWTAdmin,
  setLocalStorageJWTAdmin,
} from "../utils/storageAdmin";
import {
  getLocalStorageJWTUsuario,
  setLocalStorageJWTUsuario,
} from "../utils/storageUsuario";
import { extraerMensajeError } from "../utils/errorHandler";

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
      const hasUserContext = Boolean(user && user.rol);
      const isAdminRoute =
        typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
      const isAdmin = hasUserContext
        ? user?.rol === "Admin"
        : Boolean(getLocalStorageJWTAdmin()) && (isAdminRoute || !getLocalStorageJWTUsuario());

      if (!hasUserContext && !getLocalStorageJWTAdmin() && !getLocalStorageJWTUsuario()) {
        throw new Error("No hay sesión activa para actualizar el JWT");
      }

      const url = isAdmin ? "Admin/actualizar-jwt" : "auth/actualizar-jwt";
      const api = isAdmin ? httpAdmin : httpUsuario;

      const { data } = await api.post<ActualizarJwtResponse>(url, params);

      if (data.respuesta?.token) {
        if (isAdmin) {
          setLocalStorageJWTAdmin(data.respuesta.token);
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("adlocal_token_refreshed", {
                detail: { token: data.respuesta.token, userType: "admin" },
              })
            );
          }
        } else {
          setLocalStorageJWTUsuario(data.respuesta.token);
        }
      }

      return data;
    } catch (err: unknown) {
      const mensaje = extraerMensajeError(err, "Error al actualizar el JWT");
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
