import { useEffect, useState, type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  clearStorageUsuario,
  getLocalStorageJWTUsuario,
} from "../../utils/storageUsuario";

interface Props {
  children: ReactElement;
  roles?: string[];
}

export interface JwtPayload {
  sub: string;
  id: string;
  nombre: string;
  rol: string;
  comercioId: string[];
  RedeemRewards: string;
  RedeemMonthFree: string;
  codigoReferido: string;
  planId: string;
  planTipo: string;
  nivelVisibilidad: string;
  estado: string;
  maxNegocios: string;
  maxProductos: string;
  maxFotos: string;
  permiteCatalogo: string;
  tieneAnalytics: string;
  badge: string;
  exp: number;
  iss: string;
  role?: string;
  usuario_id?: string;
  correo?: string;
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
}

export default function PrivateRouteUsuario({ children, roles }: Props) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const token = getLocalStorageJWTUsuario();

      if (!token) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setAuthenticated(false);
        return;
      }

      const decoded = jwtDecode<JwtPayload>(token);
      const now = Math.floor(Date.now() / 1000);

      if (!decoded.exp || decoded.exp <= now) {
        clearStorageUsuario();
        setAuthenticated(false);
        return;
      }

      const rol =
        decoded.rol ||
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      if (roles && roles.length > 0 && (!rol || !roles.includes(rol))) {
        clearStorageUsuario();
        setAuthenticated(false);
        return;
      }

      setAuthenticated(true);
    } catch {
      clearStorageUsuario();
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, [roles]);

  if (loading) return null;

  if (!authenticated) {
    return <Navigate to="/usuario/login" replace />;
  }

  return children;
}
