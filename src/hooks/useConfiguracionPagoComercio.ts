import { useCallback, useState } from "react";
import Swal from "sweetalert2";

import { configuracionPagoComercioApi } from "../services/configuracionPagoComercioApi";

import type { ConfiguracionPagoComercioDto } from "../types/User/pagosComercio";

export const useConfiguracionPagoComercio = () => {
  const [configuracion, setConfiguracion] =
    useState<ConfiguracionPagoComercioDto | null>(null);

  const [loading, setLoading] = useState(false);

  const obtener = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await configuracionPagoComercioApi.obtener();

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      setConfiguracion(data.respuesta ?? null);
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Error",
        "No se pudo cargar la configuración de pagos.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const guardar = async (
    dto: ConfiguracionPagoComercioDto,
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const { data } = await configuracionPagoComercioApi.guardar(dto);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return false;
      }

      setConfiguracion(data.respuesta);

      Swal.fire("Éxito", data.mensaje, "success");

      return true;
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje ??
          "No se pudo guardar la configuración de pagos.",
        "error",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    configuracion,
    loading,

    obtener,
    guardar,
  };
};
