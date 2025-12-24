import React, { useState, useEffect, type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext, type User } from "../context/UserContext ";


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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        localStorage.removeItem("token");
        setUser(null);
      } else {
        setUser(decoded);
      }
    } catch (error) {
      console.error("Token inválido", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default PrivateRoute;
