import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { JSX } from "react";

interface JwtPayload {
  exp: number;
  role: string;
}

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // eslint-disable-next-line react-hooks/purity
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp < now) {
      localStorage.removeItem("token");
      return <Navigate to="/login" replace />;
    }

    if (decoded.role !== "ADMIN") {
      return <Navigate to="/no-autorizado" replace />;
    }

    return children;
  } catch {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;
