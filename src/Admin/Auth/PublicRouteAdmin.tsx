import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { ReactElement } from "react";
import {
  clearStorageAdmin,
  getLocalStorageJWTAdmin,
} from "../../utils/storageAdmin";

interface Props {
  children: ReactElement;
}

interface JwtPayload {
  exp: number;
  role?: string;
  rol?: string;
  admin_id?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export default function PublicRouteAdmin({ children }: Props) {
  const token = getLocalStorageJWTAdmin();

  if (!token) return children;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    // eslint-disable-next-line react-hooks/purity
    const now = Math.floor(Date.now() / 1000);

    if (!decoded.exp || decoded.exp <= now) {
      clearStorageAdmin();
      return children;
    }

    const role =
      decoded.role ||
      decoded.rol ||
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (role === "Admin") {
      // eslint-disable-next-line react-hooks/error-boundaries
      return <Navigate to="/admin/app" replace />;
    }

    clearStorageAdmin();
    return children;
  } catch {
    clearStorageAdmin();
    return children;
  }
}
