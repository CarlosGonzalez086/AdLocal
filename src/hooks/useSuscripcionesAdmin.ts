import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import type { SuscripcionListadoDto } from "../types/Admin/suscripciones";
import { suscripcionesService } from "../services/suscripciones.api";

interface ListarParams {
  page: number;
  rows: number;
}

export const useSuscripcionesAdmin = () => {
  const [suscripciones, setSuscripciones] = useState<SuscripcionListadoDto[]>(
    [],
  );
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const listar = useCallback(async ({ page, rows }: ListarParams) => {
    setLoading(true);
    try {
      const resp = await suscripcionesService.getAll({
        page: page + 1,
        pageSize: rows,
      });

      setSuscripciones(resp.data.respuesta.items);
      setTotal(resp.data.respuesta.totalItems);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error al cargar suscripciones",
        "No se pudo obtener la información. Intenta nuevamente.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    suscripciones,
    total,
    loading,
    listar,
  };
};
