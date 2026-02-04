import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  dashboardService,
  type SuscripcionDashboardDto,
} from "../services/dashboard.api";

export const useDashboardSuscripciones = () => {
  const [data, setData] = useState<SuscripcionDashboardDto | null>(null);
  const [loading, setLoading] = useState(false);

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await dashboardService.getSuscripcionesStats();
      setData(resp.data.respuesta);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error al cargar dashboard",
        "No se pudo obtener la información del dashboard.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return {
    data,
    loading,
    reload: cargar,
  };
};
