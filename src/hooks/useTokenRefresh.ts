import { useEffect, useRef, useState, useCallback } from "react";
import {
  getTokenRemainingSeconds,
  isTokenExpiringSoon,
  renovarTokenAdmin,
  renovarTokenUsuario,
} from "../services/tokenRefresh";
import { getLocalStorageJWTUsuario } from "../utils/storageUsuario";
import { getLocalStorageJWTAdmin } from "../utils/storageAdmin";

interface UseTokenRefreshOptions {
  userType: "usuario" | "admin";
  /** Umbral en segundos para considerar que el token está por vencer y renovarlo (por defecto 300s / 5min) */
  thresholdSeconds?: number;
  /** Intervalo en milisegundos para verificar el estado del token (por defecto 60000ms / 1min) */
  checkIntervalMs?: number;
  /** Activar renovación proactiva ante eventos de interacción del usuario */
  enableUserActivityRefresh?: boolean;
}

export const useTokenRefresh = ({
  userType,
  thresholdSeconds = 300,
  checkIntervalMs = 60_000,
  enableUserActivityRefresh = true,
}: UseTokenRefreshOptions) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date | null>(null);

  const refreshingRef = useRef(false);
  const lastActivityCheckRef = useRef<number>(0);

  const getToken = useCallback(() => {
    return userType === "admin"
      ? getLocalStorageJWTAdmin()
      : getLocalStorageJWTUsuario();
  }, [userType]);

  const renovar = useCallback(async () => {
    if (refreshingRef.current) return;
    const token = getToken();
    if (!token) return;

    try {
      refreshingRef.current = true;
      setIsRefreshing(true);

      if (userType === "admin") {
        await renovarTokenAdmin();
      } else {
        await renovarTokenUsuario();
      }

      setLastRefreshedAt(new Date());
    } catch (err) {
      console.warn(`[TokenRefresh] Error renovando sesión para ${userType}:`, err);
    } finally {
      refreshingRef.current = false;
      setIsRefreshing(false);
    }
  }, [getToken, userType]);

  // Vigilante periódico en segundo plano
  useEffect(() => {
    const checkAndRefresh = async () => {
      const token = getToken();
      if (!token) return;

      // Si le quedan menos del umbral de segundos o ya expiró recientemente
      if (isTokenExpiringSoon(token, thresholdSeconds)) {
        await renovar();
      }
    };

    // Ejecutar verificación inicial
    void checkAndRefresh();

    const intervalId = window.setInterval(() => {
      void checkAndRefresh();
    }, checkIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [checkIntervalMs, getToken, renovar, thresholdSeconds]);

  // Renovación proactiva ante actividad de usuario si el token entra en zona de renovación
  useEffect(() => {
    if (!enableUserActivityRefresh) return;

    const handleUserActivity = () => {
      const now = Date.now();
      // Throttle: no evaluar más de una vez cada 60 segundos
      if (now - lastActivityCheckRef.current < 60_000) return;
      lastActivityCheckRef.current = now;

      const token = getToken();
      if (!token) return;

      const remaining = getTokenRemainingSeconds(token);
      // Si el usuario está usando la aplicación y al token le quedan menos de 10 minutos (600s)
      if (remaining > 0 && remaining <= Math.max(thresholdSeconds, 600)) {
        void renovar();
      }
    };

    window.addEventListener("mousedown", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });
    window.addEventListener("touchstart", handleUserActivity, { passive: true });

    return () => {
      window.removeEventListener("mousedown", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("touchstart", handleUserActivity);
    };
  }, [enableUserActivityRefresh, getToken, renovar, thresholdSeconds]);

  return {
    renovar,
    isRefreshing,
    lastRefreshedAt,
  };
};
