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
      setTarjetas(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar las tarjetas", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const crear = async (dto: CrearTarjetaDto) => {
    console.log(dto);

    setLoading(true);
    try {
      const result = tarjetaSchema.safeParse(dto);
      if (!result.success) {
        const firstError = Object.values(
          result.error.flatten().fieldErrors
        ).flat()[0];
        Swal.fire("Error", firstError || "Datos inválidos", "error");
        return;
      }

      await tarjetaApi.crear(dto);
      Swal.fire("Creada", "Tarjeta registrada correctamente", "success");
      await listar();
    } catch (error) {
      console.error(error);
      const mensaje =
        (error as any)?.response?.data?.mensaje ?? "No se pudo crear la tarjeta";
      Swal.fire("Error", String(mensaje), "error");
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
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await tarjetaApi.eliminar(id);
      Swal.fire("Eliminada", "Tarjeta eliminada correctamente", "success");
      await listar();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar la tarjeta", "error");
    } finally {
      setLoading(false);
    }
  };

  const setDefault = async (id: number) => {
    setLoading(true);
    try {
      await tarjetaApi.setDefault(id);
      Swal.fire("Actualizada", "Tarjeta establecida como principal", "success");
      await listar();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar la tarjeta", "error");
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
