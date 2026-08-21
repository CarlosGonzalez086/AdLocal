import { useCallback, useState } from "react";
import { comisionesAdminApi } from "../services/comisionesAdminApi";
import type { ComisionComercioResumen, ComisionMovimiento, ComisionesDashboard } from "../types/Admin/comisiones";

export const useComisionesAdmin = () => {
  const [dashboard, setDashboard] = useState<ComisionesDashboard | null>(null);
  const [resumen, setResumen] = useState<ComisionComercioResumen[]>([]);
  const [movimientos, setMovimientos] = useState<ComisionMovimiento[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cargarDashboard = useCallback(async () => { try { const { data } = await comisionesAdminApi.dashboard(); setDashboard(data.respuesta ?? null); } catch { setDashboard(null); } }, []);
  const cargar = useCallback(async (periodo: string, page: number, rows: number, comercioId?: number, estatus?: number) => {
    setLoading(true); setError(null);
    try {
      const [r, m] = await Promise.all([comisionesAdminApi.resumen(periodo), comisionesAdminApi.movimientos(page + 1, rows, comercioId, estatus)]);
      setResumen(r.data.respuesta ?? []); setMovimientos(m.data.respuesta?.items ?? []); setTotal(m.data.respuesta?.totalItems ?? 0);
    } catch (err: any) { setError(err?.response?.data?.mensaje || "No fue posible cargar las comisiones."); }
    finally { setLoading(false); }
  }, []);
  const liquidar = async (comercioId: number, periodo: string) => { await comisionesAdminApi.liquidar(comercioId, periodo); };
  return { dashboard, resumen, movimientos, total, loading, error, cargarDashboard, cargar, liquidar };
};
