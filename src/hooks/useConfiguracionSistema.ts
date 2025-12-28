import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  configuracionApi,
  type StripeConfiguracionDto,
} from "../services/configuracionApi";

export const useConfiguracionSistema = () => {
  const [loading, setLoading] = useState(false);
  const [configuraciones, setConfiguraciones] = useState<any[]>([]);

  // 🔄 Cargar todas las configuraciones (para mapear a formularios)
  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await configuracionApi.obtenerTodas();

      setConfiguraciones(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo cargar la configuración del sistema",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔐 Guardar Stripe
  const guardarStripe = async (dto: StripeConfiguracionDto) => {
    try {
      setLoading(true);
      await configuracionApi.guardarStripe(dto);
      Swal.fire("Guardado", "Configuración de Stripe actualizada", "success");
      await cargar();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo guardar la configuración de Stripe",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    configuraciones,
    cargar,
    guardarStripe,
  };
};
