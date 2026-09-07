import axios from "axios";
import { jwtDecode } from "jwt-decode";
import type { RenovarTokenResponse } from "../types/tokenRefresh";
import {
  getLocalStorageJWTUsuario,
  getLocalStorageRefreshTokenUsuario,
  setLocalStorageJWTUsuario,
  setLocalStorageRefreshTokenUsuario,
  setLocalStorageUsuario,
} from "../utils/storageUsuario";
import {
  getLocalStorageJWTAdmin,
  getLocalStorageRefreshTokenAdmin,
  setLocalStorageJWTAdmin,
  setLocalStorageRefreshTokenAdmin,
  setLocalStorageAdmin,
} from "../utils/storageAdmin";

const getBaseApiUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  const baseUrl = envUrl ? envUrl.replace(/\/+$/, "") : "https://adlocalapi.onrender.com";
  return `${baseUrl}/api`;
};

export interface DecodedToken {
  exp?: number;
  sub?: string;
  id?: string;
  nombre?: string;
  rol?: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Devuelve los segundos restantes de vida útil del token.
 * Si el token es inválido o ya expiró, devuelve un valor <= 0.
 */
export const getTokenRemainingSeconds = (token: string | null | undefined): number => {
  if (!token) return 0;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    if (!decoded.exp) return 0;
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp - now;
  } catch {
    return 0;
  }
};

/**
 * Verifica si el token expiró o está por expirar dentro de la ventana de umbral (por defecto 5 min = 300s).
 */
export const isTokenExpiringSoon = (
  token: string | null | undefined,
  thresholdSeconds = 300
): boolean => {
  const remaining = getTokenRemainingSeconds(token);
  return remaining <= thresholdSeconds;
};

/**
 * Endpoint 1: Endpoint Principal / Central (Recomendado para todos los roles)
 * Ruta: POST /api/Auth/renovar-token
 * Controlador: AuthController.cs
 * Para: Comercio, Cliente, Admin y Colaborador.
 */
export const renovarTokenUsuario = async (): Promise<RenovarTokenResponse> => {
  const currentToken = getLocalStorageJWTUsuario();
  const currentRefreshToken = getLocalStorageRefreshTokenUsuario();
  if (!currentToken && !currentRefreshToken) {
    throw new Error("No hay token de usuario almacenado para renovar");
  }

  const endpoint = `${getBaseApiUrl()}/Auth/renovar-token`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: currentToken ? `Bearer ${currentToken}` : "",
  };

  const response = await axios.post<RenovarTokenResponse>(
    endpoint,
    { token: currentToken, tokenActual: currentToken, refreshToken: currentRefreshToken },
    { headers, withCredentials: true }
  );

  const data = response.data;
  const nuevoToken = data?.respuesta?.token;

  if (nuevoToken) {
    setLocalStorageJWTUsuario(nuevoToken);
    if (data?.respuesta?.refreshToken) {
      setLocalStorageRefreshTokenUsuario(data.respuesta.refreshToken);
    }

    if (data.respuesta.usuario) {
      try {
        setLocalStorageUsuario(
          "usuario",
          JSON.stringify(data.respuesta.usuario)
        );
      } catch (err) {
        console.warn("No se pudo guardar usuario en localStorage:", err);
      }
    }

    // Notificar a componentes en tiempo real
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("adlocal_token_refreshed", {
          detail: {
            token: nuevoToken,
            userType: "usuario",
            usuario: data.respuesta.usuario,
          },
        })
      );
    }
  }

  return data;
};

/**
 * Endpoint 3: Endpoint Específico para Administradores
 * Ruta: POST /api/Admin/renovar-token
 * Controlador: AdminController.cs
 * Para: Administradores del panel de control de la plataforma.
 */
export const renovarTokenAdmin = async (): Promise<RenovarTokenResponse> => {
  const currentToken = getLocalStorageJWTAdmin();
  const currentRefreshToken = getLocalStorageRefreshTokenAdmin();
  if (!currentToken && !currentRefreshToken) {
    throw new Error("No hay token de admin almacenado para renovar");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: currentToken ? `Bearer ${currentToken}` : "",
  };

  const endpointAdmin = `${getBaseApiUrl()}/Admin/renovar-token`;
  const endpointAuth = `${getBaseApiUrl()}/Auth/renovar-token`;

  let response;
  try {
    response = await axios.post<RenovarTokenResponse>(
      endpointAdmin,
      { token: currentToken, tokenActual: currentToken, refreshToken: currentRefreshToken },
      { headers, withCredentials: true }
    );
  } catch (error: unknown) {
    // Si el endpoint específico de Admin retorna 404, usar fallback al Endpoint Central de Auth
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      response = await axios.post<RenovarTokenResponse>(
        endpointAuth,
        { token: currentToken, tokenActual: currentToken, refreshToken: currentRefreshToken },
        { headers, withCredentials: true }
      );
    } else {
      throw error;
    }
  }

  const data = response.data;
  const nuevoToken = data?.respuesta?.token;

  if (nuevoToken) {
    setLocalStorageJWTAdmin(nuevoToken);
    if (data?.respuesta?.refreshToken) {
      setLocalStorageRefreshTokenAdmin(data.respuesta.refreshToken);
    }

    if (data.respuesta.usuario) {
      try {
        setLocalStorageAdmin(
          "admin",
          JSON.stringify(data.respuesta.usuario)
        );
      } catch (err) {
        console.warn("No se pudo guardar admin en localStorage:", err);
      }
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("adlocal_token_refreshed", {
          detail: {
            token: nuevoToken,
            userType: "admin",
            usuario: data.respuesta.usuario,
          },
        })
      );
    }
  }

  return data;
};
