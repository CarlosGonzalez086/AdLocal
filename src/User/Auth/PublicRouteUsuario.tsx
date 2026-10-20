import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { ReactElement } from "react";
import {
  getLocalStorageJWTUsuario,
} from "../../utils/storageUsuario";

interface Props {
  children: ReactElement;
}

interface JwtPayload {
  exp: number;
  role?: string;
  rol?: string;
  usuario_id?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export default function PublicRouteUsuario({ children }: Props) {
  const token = getLocalStorageJWTUsuario();

  if (!token) return children;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // eslint-disable-next-line react-hooks/purity
    const now = Math.floor(Date.now() / 1000);

    if (!decoded.exp || decoded.exp <= now) {
      return children;
    }

    const role =
      decoded.role ||
      decoded.rol ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === "Comercio" || role === "Colaborador") {
      return <Navigate to="/usuario/app" replace />;
    }

    return children;
  } catch {
    return children;
  }
}
