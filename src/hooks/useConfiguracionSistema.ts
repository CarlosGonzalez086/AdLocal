import { useCallback, useState } from "react";

import Swal from "sweetalert2";

import {
  configuracionApi,
  type ClavesConfigDto,
  type ComisionMarketplaceDto,
  type EmailConfiguracionDto,
  type StripeConfiguracionDto,
} from "../services/configuracionApi";

export const useConfiguracionSistema = () => {
  const [loading, setLoading] = useState(false);

  const [configuraciones, setConfiguraciones] = useState<any[]>([]);

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
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const guardarStripe = async (dto: StripeConfiguracionDto) => {
    try {
      setLoading(true);

      await configuracionApi.guardarStripe(dto);

      await Swal.fire(
        "Guardado",
        "Configuración de Stripe actualizada",
        "success",
      );

      await cargar();
    } catch (error) {
      console.error(error);

      await Swal.fire(
        "Error",
        "No se pudo guardar la configuración de Stripe",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const guardarClaves = async (dto: ClavesConfigDto) => {
    try {
      setLoading(true);

      await configuracionApi.guardarClaves(dto);

      await Swal.fire(
        "Guardado",
        "Configuración de claves actualizada",
        "success",
      );

      await cargar();
    } catch (error) {
      console.error(error);

      await Swal.fire(
        "Error",
        "No se pudo guardar la configuración de claves",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const guardarComisionMarketplace = async (dto: ComisionMarketplaceDto) => {
    try {
      setLoading(true);

      await configuracionApi.guardarComisionMarketplace(dto);

      await Swal.fire(
        "Guardado",
        "Configuración de comisión actualizada",
        "success",
      );

      await cargar();

      return true;
    } catch (error) {
      console.error(error);

      await Swal.fire(
        "Error",
        "No se pudo guardar la configuración de comisión",
        "error",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };
  const guardarEmail = async (dto: EmailConfiguracionDto) => {
    try {
      setLoading(true);

      await configuracionApi.guardarEmail(dto);

      await Swal.fire(
        "Guardado",
        "Configuración de correo actualizada",
        "success",
      );

      await cargar();

      return true;
    } catch (error) {
      console.error(error);

      await Swal.fire(
        "Error",
        "No se pudo guardar la configuración de correo",
        "error",
      );

      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    configuraciones,
    cargar,
    guardarStripe,
    guardarClaves,
    guardarComisionMarketplace,
    guardarEmail,
  };
};
