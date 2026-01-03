import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext ";

interface ActualizarJwtParams {
  email: string;
  updateJWT: boolean;
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  comercioId?: number;
}

interface ActualizarJwtResponse {
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
      const { data } = await axios.post<ActualizarJwtResponse>(
        user.rol == "Admin" ? `${import.meta.env.VITE_API_URL}/Admin/actualizar-jwt` : `${import.meta.env.VITE_API_URL}/auth/actualizar-jwt`,
        params
      );

      if (data.respuesta?.token) {
        localStorage.setItem("token", data.respuesta.token);
      }

      return data;
    } catch (err: any) {
      const mensaje =
        err?.response?.data?.mensaje || "Error al actualizar el JWT";

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
