import { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { planApi, type PlanCreateDto } from "../services/planApi";

export const usePlanes = () => {
  const [planes, setPlanes] = useState<PlanCreateDto[]>([]);
  const [loading, setLoading] = useState(false);

  const listar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await planApi.getAll();
      setPlanes(data.respuesta ?? []);
    } catch (error) {
      console.log(error);

      Swal.fire(
        "Error",
        "No se pudo cargar la información de los planes",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const guardar = async (plan: PlanCreateDto) => {
    try {
      setLoading(true);

      if (plan.id) {
        await planApi.actualizar(plan.id, plan);
        Swal.fire("Actualizado", "Plan actualizado", "success");
      } else {
        await planApi.crear(plan);
        Swal.fire("Creado", "Plan creado", "success");
      }

      listar();
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "No se pudo guardar el plan", "error");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id: number) => {
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
      listar();
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "No se pudo eliminar el plan", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    listar();
  }, [listar]);

  return {
    planes,
    loading,
    guardar,
    eliminar,
    refrescar: listar,
  };
};
