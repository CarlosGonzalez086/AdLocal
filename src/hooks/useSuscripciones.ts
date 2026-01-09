import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  suscripcionApi,
  type SuscripcionCreateDto,
  type SuscripcionDto,
} from "../services/suscripcionApi";

export const useSuscripciones = () => {
  const [suscripcion, setSuscripcion] = useState<SuscripcionDto | null>(null);
  const [loading, setLoading] = useState(false);

  const contratar = async (dto: SuscripcionCreateDto): Promise<void> => {
    setLoading(true);
    try {
      await suscripcionApi.contratar(dto);
      Swal.fire("Éxito", "Suscripción activada correctamente", "success");
      await obtenerMiSuscripcion();
    } catch (error: any) {
      console.error(error);
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje ?? "No se pudo contratar el plan",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const obtenerMiSuscripcion = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await suscripcionApi.miSuscripcion();
      console.log(data.respuesta);
      
      setSuscripcion(data.respuesta ?? null);
    } catch (error) {
      console.error(error);
      setSuscripcion(null);
    } finally {
      setLoading(false);
    }
  }, []);


  const cancelar = async (): Promise<void> => {
    const result = await Swal.fire({
      title: "¿Cancelar suscripción?",
      text: "Seguirás teniendo acceso hasta el fin del período",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await suscripcionApi.cancelar();
      Swal.fire("Cancelada", "Tu suscripción fue cancelada", "success");
      await obtenerMiSuscripcion();
    } catch (error: any) {
      console.error(error);
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje ?? "No se pudo cancelar la suscripción",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    suscripcion,
    loading,
    contratar,
    cancelar,
    obtenerMiSuscripcion,
  };
};
