import { useEffect, useState } from "react";
import { comercioVisitasApi } from "../services/comercioVisitasApi";
import type { ComercioVisitasStatsDto } from "../services/comercioVisitasApi";

export const useComercioVisitasStats = (comercioId?: number) => {
  const [data, setData] = useState<ComercioVisitasStatsDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!comercioId) return;

    let cancelled = false;

    // 🔁 reset al cambiar de comercio
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    setData(null);

    comercioVisitasApi
      .getStats(comercioId)
      .then((res) => {
        if (!cancelled) {
          setData(res.data.respuesta);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? "Error al cargar estadísticas");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [comercioId]);

  return {
    data,
    error,
    loading,
  };
};
