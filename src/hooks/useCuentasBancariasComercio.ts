import { useCallback, useState } from "react";
import Swal from "sweetalert2";

import { cuentasBancariasComercioApi } from "../services/cuentasBancariasComercioApi";

import type {
  CuentaBancariaComercioCreateDto,
  CuentaBancariaComercioDto,
  CuentaBancariaComercioUpdateDto,
} from "../types/User/pagosComercio";

export interface ModalActionResult {
  noClose?: boolean;
  success?: boolean;
}

export const useCuentasBancariasComercio = () => {
  const [cuentas, setCuentas] = useState<CuentaBancariaComercioDto[]>([]);

  const [loading, setLoading] = useState(false);

  const listar = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await cuentasBancariasComercioApi.obtenerTodas();

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      setCuentas(data.respuesta ?? []);
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Error",
        "No se pudieron cargar las cuentas bancarias.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = async (
    dto: CuentaBancariaComercioCreateDto,
  ): Promise<ModalActionResult> => {
    setLoading(true);

    try {
      const { data } = await cuentasBancariasComercioApi.crear(dto);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");

        return {
          noClose: true,
        };
      }

      Swal.fire("Éxito", data.mensaje, "success");

      await listar();

      return {
        success: true,
      };
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje ??
          "No se pudo registrar la cuenta bancaria.",
        "error",
      );

      return {
        noClose: true,
      };
    } finally {
      setLoading(false);
    }
  };

  const actualizar = async (
    uuid: string,
    dto: CuentaBancariaComercioUpdateDto,
  ): Promise<ModalActionResult> => {
    setLoading(true);

    try {
      const { data } = await cuentasBancariasComercioApi.actualizar(uuid, dto);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");

        return {
          noClose: true,
        };
      }

      Swal.fire("Éxito", data.mensaje, "success");

      await listar();

      return {
        success: true,
      };
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje ??
          "No se pudo actualizar la cuenta bancaria.",
        "error",
      );

      return {
        noClose: true,
      };
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (cuenta: CuentaBancariaComercioDto) => {
    const result = await Swal.fire({
      title: "Eliminar cuenta bancaria",
      text: `¿Deseas eliminar la cuenta de ${cuenta.banco}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await cuentasBancariasComercioApi.eliminar(cuenta.uuid);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Éxito", data.mensaje, "success");

      await listar();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje ??
          "No se pudo eliminar la cuenta bancaria.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const establecerPrincipal = async (cuenta: CuentaBancariaComercioDto) => {
    if (cuenta.principal) {
      return;
    }

    const result = await Swal.fire({
      title: "Establecer cuenta principal",
      text: `Las transferencias mostrarán por defecto la cuenta de ${cuenta.banco}.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, establecer",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      return;
    }

    setLoading(true);

    try {
      const { data } = await cuentasBancariasComercioApi.establecerPrincipal(
        cuenta.uuid,
      );

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Éxito", data.mensaje, "success");

      await listar();
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje ??
          "No se pudo establecer la cuenta principal.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    cuentas,
    loading,

    listar,
    crear,
    actualizar,
    eliminar,
    establecerPrincipal,
  };
};
