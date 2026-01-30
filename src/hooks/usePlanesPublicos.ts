import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { planPublicApi, type PlanCreateDto } from "../services/planPublicApi";



export const usePlanesPublicos = () => {
  const [planes, setPlanes] = useState<PlanCreateDto[]>([]);
  const [loading, setLoading] = useState(false);


  const listAllPlanesUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await planPublicApi.getAllPlanesUser();
      setPlanes(data.respuesta ?? []);
    } catch (error) {
      Swal.fire(
        "Error",
        "No se pudo cargar la información de los planes",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    planes,
    loading,
    listAllPlanesUser,
  };
};
