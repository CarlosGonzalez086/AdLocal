import { useState, useCallback } from "react";
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmDialog,
  notificarErrorApi,
} from "../utils/sweetalert";
import type { ProductoServicioDto } from "../types/User/productosServicios";
import { productosServiciosApi } from "../services/productosServiciosApi";

interface ListarParams {
  page: number;
  rows: number;
  orderBy: string;
  search: string;
  idComercio: number;
}

export const useProductosServicios = () => {
  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const listar = useCallback(
    async ({ page, rows, orderBy, search, idComercio }: ListarParams) => {
      setLoading(true);
      try {
        const { data } = await productosServiciosApi.getAllPaged({
          page: page + 1,
          pageSize: rows,
          orderBy,
          search,
          idComercio,
        });

        if (data.codigo !== "200") {
          showErrorAlert("Error", data.mensaje);
          return;
        }

        setProductos(data.respuesta.items ?? []);
        setTotal(data.respuesta.totalItems ?? 0);
      } catch (error) {
        notificarErrorApi(error, "No fue posible cargar el listado de productos.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const listarPorComercio = useCallback(async (idComercio: number) => {
    setLoading(true);
    try {
      const { data } = await productosServiciosApi.getAllByComercio(idComercio);

      if (data.codigo !== "200") {
        showErrorAlert("Error", data.mensaje);
        return;
      }

      setProductos(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      notificarErrorApi(
        error,
        "Ocurrió un error inesperado al cargar los productos y servicios del comercio",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const guardar = async (
    producto: ProductoServicioDto,
    refrescarParams?: ListarParams,
  ) => {
    setLoading(true);

    try {
      const { data } = producto.id
        ? await productosServiciosApi.actualizar(producto.id, producto)
        : await productosServiciosApi.crear(producto);

      if (data.codigo !== "200") {
        showErrorAlert("Error", data.mensaje);

        return {
          noClose: true,
        };
      }

      showSuccessAlert("Éxito", data.mensaje);

      if (refrescarParams) {
        await listar(refrescarParams);
      }

      return {
        success: true,
      };
    } catch (error) {
      notificarErrorApi(error, "Ocurrió un error al guardar el producto o servicio.");

      return {
        noClose: true,
      };
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (
    id: number,
    idComercio: number,
    refrescarParams?: ListarParams,
  ) => {
    const result = await showConfirmDialog({
      title: "Eliminar producto o servicio",
      text: "Esta acción eliminará el producto o servicio de forma permanente y no se puede deshacer.",
      icon: "warning",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      isDestructive: true,
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { data } = await productosServiciosApi.eliminar(id, idComercio);

      if (data.codigo !== "200") {
        showErrorAlert("Error", data.mensaje);
        return;
      }

      showSuccessAlert("Éxito", data.mensaje);

      if (refrescarParams) {
        await listar(refrescarParams);
      }
    } catch (error) {
      notificarErrorApi(error, "No se pudo eliminar el producto o servicio.");
    } finally {
      setLoading(false);
    }
  };

  const desactivar = async (
    id: number,
    idComercio: number,
    activo: boolean,
    refrescarParams?: ListarParams,
  ) => {
    const result = await showConfirmDialog({
      title: activo
        ? "Desactivar producto o servicio"
        : "Activar producto o servicio",
      text: activo
        ? "Este producto o servicio dejará de estar visible para los clientes, pero no se eliminará."
        : "Este producto o servicio volverá a estar disponible para los clientes.",
      icon: "warning",
      confirmButtonText: activo ? "Sí, desactivar" : "Sí, activar",
      cancelButtonText: "Cancelar",
      isDestructive: activo,
    });

    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const { data } = await productosServiciosApi.desactivar(id, idComercio);

      if (data.codigo !== "200") {
        showErrorAlert("Error", data.mensaje);
        return;
      }

      showSuccessAlert("Éxito", data.mensaje);

      if (refrescarParams) {
        await listar(refrescarParams);
      }
    } catch (error) {
      notificarErrorApi(
        error,
        "No fue posible actualizar el estado del producto o servicio.",
      );
    } finally {
      setLoading(false);
    }
  };

  const obtenerPorId = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data } = await productosServiciosApi.getById(id);

      if (data.codigo !== "200") {
        showErrorAlert("Error", data.mensaje);
        return null;
      }

      return data.respuesta;
    } catch (error) {
      notificarErrorApi(error, "No fue posible obtener el producto o servicio.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    productos,
    total,
    loading,
    listar,
    listarPorComercio,
    guardar,
    eliminar,
    desactivar,
    obtenerPorId,
  };
};
