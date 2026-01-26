import { useState, useCallback, useContext } from "react";
import Swal from "sweetalert2";
import {
  suscripcionApi,
  type SuscripcionCreateDto,
  type SuscripcionDto,
} from "../services/suscripcionApi";
import { UserContext } from "../context/UserContext ";
import { useActualizarJwt } from "./useActualizarJwt";

export const useSuscripciones = () => {
  const [suscripcion, setSuscripcion] = useState<SuscripcionDto | null>(null);
  const user = useContext(UserContext);
  const { actualizarJwt } = useActualizarJwt();
  const [loading, setLoading] = useState(false);

  const contratar = async (dto: SuscripcionCreateDto): Promise<void> => {
    setLoading(true);
    try {
      const { data } = await suscripcionApi.contratar(dto);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Éxito", data.mensaje, "success");
      await actualizarJwt({
        email: user.sub,
        updateJWT: true,
      });
      window.location.reload();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al contratar la suscripción",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const obtenerMiSuscripcion = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await suscripcionApi.miSuscripcion();

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        setSuscripcion(null);
        return;
      }

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
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { data } = await suscripcionApi.cancelar();

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Cancelada", data.mensaje, "success");
      await obtenerMiSuscripcion();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al cancelar la suscripción",
        "error",
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
