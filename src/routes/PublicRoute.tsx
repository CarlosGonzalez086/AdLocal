import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { ReactElement } from "react";

interface Props {
  children: ReactElement;
}

interface JwtPayload {
  exp: number;
  rol: "Admin" | "Comercio";
}

const PublicRoute = ({ children }: Props) => {
  const token = localStorage.getItem("token");

  if (!token) return children;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // eslint-disable-next-line react-hooks/purity
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp > now) {
      return (
        <Navigate
          to={decoded.rol === "Admin" ? "/Admin" : "/app"}
          replace
        />
      );
    }

    localStorage.removeItem("token");
    return children;
  } catch {
    localStorage.removeItem("token");
    return children;
  }
};

export default PublicRoute;
