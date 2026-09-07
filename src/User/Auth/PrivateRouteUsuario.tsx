import { useEffect, useState, type ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  clearStorageUsuario,
  getLocalStorageJWTUsuario,
} from "../../utils/storageUsuario";
import { renovarTokenUsuario } from "../../services/tokenRefresh";
import { useTokenRefresh } from "../../hooks/useTokenRefresh";

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

  // Mantiene la sesión siempre activa renovando el token proactivamente en segundo plano
  useTokenRefresh({
    userType: "usuario",
    thresholdSeconds: 300,
    checkIntervalMs: 60_000,
    enableUserActivityRefresh: true,
  });

  useEffect(() => {
    let isMounted = true;

    const validarToken = async () => {
      try {
        const token = getLocalStorageJWTUsuario();

        if (!token) {
          if (isMounted) {
            setAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        let activeToken = token;
        let decoded: JwtPayload;

        try {
          decoded = jwtDecode<JwtPayload>(activeToken);
        } catch {
          clearStorageUsuario();
          if (isMounted) {
            setAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        const now = Math.floor(Date.now() / 1000);

        // Si ya expiró o le queda menos de 1 minuto, intentar renovar inmediatamente
        if (!decoded.exp || decoded.exp <= now + 60) {
          try {
            const renovacion = await renovarTokenUsuario();
            const nuevoToken = renovacion?.respuesta?.token;
            if (nuevoToken) {
              activeToken = nuevoToken;
              decoded = jwtDecode<JwtPayload>(activeToken);
            } else {
              throw new Error("Respuesta de renovación sin token");
            }
          } catch {
            clearStorageUsuario();
            if (isMounted) {
              setAuthenticated(false);
              setLoading(false);
            }
            return;
          }
        }

        const rol =
          decoded.rol ||
          decoded.role ||
          decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (roles && roles.length > 0 && (!rol || !roles.includes(rol))) {
          clearStorageUsuario();
          if (isMounted) {
            setAuthenticated(false);
            setLoading(false);
          }
          return;
        }

        if (isMounted) {
          setAuthenticated(true);
          setLoading(false);
        }
      } catch {
        clearStorageUsuario();
        if (isMounted) {
          setAuthenticated(false);
          setLoading(false);
        }
      }
    };

    void validarToken();

    return () => {
      isMounted = false;
    };
  }, [roles]);

  if (loading) return null;

  if (!authenticated) {
    return <Navigate to="/usuario/login" replace />;
  }

  return children;
}
