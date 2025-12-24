import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState, type ReactElement } from "react";

interface PublicRouteProps {
  children: ReactElement;
}

interface JwtPayload {
  exp: number;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp > now) {
        setRedirect(true);
      } else {
        localStorage.removeItem("token");
      }
    } catch (error) {
      console.error("Token inválido", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return null;

  if (redirect) return <Navigate to="/" replace />;

  return children;
};

export default PublicRoute;
