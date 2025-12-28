import { useState, useEffect, type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { useActualizarJwt } from "../hooks/useActualizarJwt";
import { UserContext, type User } from "../context/UserContext";

interface PrivateRouteProps {
  children: ReactElement;
}

interface JwtPayload {
  sub: string;
  id: string;
  nombre: string;
  rol: string;
  exp: number;
  iss: string;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { actualizarJwt } = useActualizarJwt();

  useEffect(() => {
    const validarToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
          const response = await actualizarJwt({
            email: decoded.sub,
            updateJWT: true,
          });

          const nuevoToken = response?.respuesta?.token;

          if (!nuevoToken) throw new Error("No se pudo refrescar el token");

          localStorage.setItem("token", nuevoToken);
          setUser(jwtDecode<JwtPayload>(nuevoToken));
        } else {
          setUser(decoded);
        }
      } catch (error) {
        console.error("Sesión inválida", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validarToken();
  }, []);

  if (loading) return null;

  // 🔐 AQUÍ ESTÁ LA CLAVE
  if (!user) return <Navigate to="/login" replace />;

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};

export default PrivateRoute;
