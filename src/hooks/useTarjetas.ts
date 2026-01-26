import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  tarjetaApi,
  type CrearTarjetaDto,
  type TarjetaDto,
} from "../services/tarjetaApi";
import { tarjetaSchema } from "../schemas/tarjeta.schema";

export const useTarjetas = () => {
  const [tarjetas, setTarjetas] = useState<TarjetaDto[]>([]);
  const [loading, setLoading] = useState(false);

  const listar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tarjetaApi.listar();

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      setTarjetas(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al cargar las tarjetas",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = async (dto: CrearTarjetaDto) => {
    setLoading(true);
    try {
      const result = tarjetaSchema.safeParse(dto);
      if (!result.success) {
        const firstError = Object.values(
          result.error.flatten().fieldErrors,
        ).flat()[0];

        Swal.fire("Error", firstError || "Datos inválidos", "error");
        return;
      }

      const { data } = await tarjetaApi.crear(dto);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Creada", data.mensaje, "success");
      await listar();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al crear la tarjeta",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Eliminar tarjeta?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { data } = await tarjetaApi.eliminar(id);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Eliminada", data.mensaje, "success");
      await listar();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al eliminar la tarjeta",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const setDefault = async (id: number) => {
    const result = await Swal.fire({
      title: "¿Establecer tarjeta como predeterminada?",
      text: "Esta tarjeta se usará por defecto para pagos.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, establecer",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const { data } = await tarjetaApi.setDefault(id);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Actualizada", data.mensaje, "success");
      await listar();
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al actualizar la tarjeta",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    tarjetas,
    loading,
    listar,
    crear,
    eliminar,
    setDefault,
  };
};
