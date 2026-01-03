import { useState, useEffect, useRef, type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useActualizarJwt } from "../hooks/useActualizarJwt";
import { UserContext, type User } from "../context/UserContext ";

interface PrivateRouteProps {
  children: ReactElement;
  role?: string;
}

interface JwtPayload {
  sub: string;
  id: string;
  nombre: string;
  rol: string;
  exp: number;
  iss: string;
  FotoUrl: string;
}

const PrivateRoute = ({ children, role }: PrivateRouteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { actualizarJwt } = useActualizarJwt();
  const executedRef = useRef(false);

  useEffect(() => {
    if (executedRef.current) return;
    executedRef.current = true;

    const validarToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        let decoded = jwtDecode<JwtPayload>(token);
        const now = Math.floor(Date.now() / 1000);

        if (decoded.exp < now) {
          const response = await actualizarJwt({
            email: decoded.sub,
            updateJWT: true,
          });

          const nuevoToken = response?.respuesta?.token;
          if (!nuevoToken) throw new Error("No se pudo refrescar el token");

          localStorage.setItem("token", nuevoToken);
          decoded = jwtDecode<JwtPayload>(nuevoToken);
        }

        setUser(decoded);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    validarToken();
  }, [actualizarJwt]);

  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;

  if (role && user.rol !== role) {
    if (user.rol === "Admin") return <Navigate to="/Admin" replace />;
    if (user.rol === "Comercio") return <Navigate to="/app" replace />;
    return <Navigate to="/login" replace />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default PrivateRoute;
