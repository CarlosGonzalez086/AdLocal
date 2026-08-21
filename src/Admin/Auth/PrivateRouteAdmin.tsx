import { useEffect, useState, type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  clearStorageAdmin,
  getLocalStorageJWTAdmin,
} from "../../utils/storageAdmin";

interface Props {
  children: ReactElement;
  roles?: string[];
}

export interface JwtPayload {
  exp: number;
  rol?: string;
  role?: string;
  admin_id?: string;
  nombre?: string;
  correo?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export default function PrivateRouteAdmin({ children, roles }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const token = getLocalStorageJWTAdmin();

      if (!token) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuthenticated(false);
        return;
      }

      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);

      if (!decoded.exp || decoded.exp <= now) {
        clearStorageAdmin();
        setAuthenticated(false);
        return;
      }

      const rol =
        decoded.rol ||
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (roles && roles.length > 0 && (!rol || !roles.includes(rol))) {
        clearStorageAdmin();
        setAuthenticated(false);
        return;
      }

      setAuthenticated(true);
    } catch {
      clearStorageAdmin();
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [roles]);

  if (loading) return null;

  if (!authenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
