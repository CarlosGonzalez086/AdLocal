import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { planApi, type PlanCreateDto } from "../services/planApi";

interface ListarParams {
  page: number;
  rows: number;
  orderBy: string;
  search: string;
}

export const usePlanes = () => {
  const [planes, setPlanes] = useState<PlanCreateDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const listar = useCallback(
    async ({ page, rows, orderBy, search }: ListarParams) => {
      setLoading(true);
      try {
        const { data } = await planApi.getAll({
          page: page + 1,
          pageSize: rows,
          orderBy,
          search,
        });

        setPlanes(data.respuesta?.data ?? []);
        setTotal(data.respuesta?.totalRecords ?? 0);
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          "No se pudo cargar la información de los planes",
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const guardar = async (
    plan: PlanCreateDto,
    refrescarParams: ListarParams
  ): Promise<void> => {
    setLoading(true);
    try {
      if (plan.id) {
        await planApi.actualizar(plan.id, plan);
        Swal.fire("Actualizado", "Plan actualizado", "success");
      } else {
        await planApi.crear(plan);
        Swal.fire("Creado", "Plan creado", "success");
      }

      await listar(refrescarParams);
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id: number, refrescarParams: ListarParams) => {
    const result = await Swal.fire({
      title: "¿Eliminar plan?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await planApi.eliminar(id);
      Swal.fire("Eliminado", "Plan eliminado", "success");
      listar(refrescarParams);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar el plan", "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    planes,
    total,
    loading,
    listar,
    guardar,
    eliminar,
  };
};
