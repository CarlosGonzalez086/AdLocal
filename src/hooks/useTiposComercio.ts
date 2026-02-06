import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  tipoComercioApi,
  type TipoComercioCreateDto,
  type TipoComercioDto,
} from "../services/tipoComercioApi";

interface ListarParams {
  page: number;
  rows: number;
  orderBy: string;
  search: string;
}

export const useTiposComercio = () => {
  const [tipos, setTipos] = useState<TipoComercioDto[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const [tiposSelect, setTiposSelect] = useState<{ id: number; nombre: string }[]>([]);
  const [loadingSelect, setLoadingSelect] = useState(false);

  const listar = useCallback(async ({ page, rows, orderBy, search }: ListarParams) => {
    setLoading(true);
    try {
      const { data } = await tipoComercioApi.getAllPaged(page, rows, orderBy, search);
      setTipos(data.respuesta?.items ?? []);
      setTotal(data.respuesta?.totalItems ?? 0);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar los tipos de comercio", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const guardar = async (tipo: TipoComercioCreateDto, refrescarParams: ListarParams) => {
    setLoading(true);
    try {
      if (tipo.id) {
        await tipoComercioApi.actualizar(tipo.id, tipo);
        Swal.fire("Actualizado", "Tipo de comercio actualizado", "success");
      } else {
        await tipoComercioApi.crear(tipo);
        Swal.fire("Creado", "Tipo de comercio creado", "success");
      }
      await listar(refrescarParams);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo guardar el tipo de comercio", "error");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id: number, refrescarParams: ListarParams) => {
    const result = await Swal.fire({
      title: "¿Eliminar tipo de comercio?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      await tipoComercioApi.eliminar(id);
      Swal.fire("Eliminado", "Tipo de comercio eliminado", "success");
      await listar(refrescarParams);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo eliminar el tipo de comercio", "error");
    } finally {
      setLoading(false);
    }
  };

  const getById = async (id: number): Promise<TipoComercioDto | null> => {
    try {
      const { data } = await tipoComercioApi.getById(id);
      return data.respuesta ?? null;
    } catch {
      return null;
    }
  };

  const listarParaSelect = async () => {
    setLoadingSelect(true);
    try {
      const { data } = await tipoComercioApi.getAllForSelect();
      setTiposSelect(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar los tipos de comercio para select", "error");
    } finally {
      setLoadingSelect(false);
    }
  };

  return {
    tipos,
    total,
    loading,
    tiposSelect,
    loadingSelect,
    listar,
    listarParaSelect,
    guardar,
    eliminar,
    getById,
  };
};
