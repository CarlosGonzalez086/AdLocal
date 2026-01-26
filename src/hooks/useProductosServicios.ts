import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  productosServiciosApi,
  type ProductoServicioDto,
} from "../services/productosServiciosApi";

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

  // Listar paginados
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
          Swal.fire("Error", data.mensaje, "error");
          return;
        }

        setProductos(data.respuesta.items ?? []);
        setTotal(data.respuesta.totalItems ?? 0);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Listar todos de un comercio específico
  const listarPorComercio = useCallback(async (idComercio: number) => {
    setLoading(true);
    try {
      const { data } = await productosServiciosApi.getAllByComercio(idComercio);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      setProductos(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al cargar los productos y servicios del comercio",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear o actualizar producto/servicio
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
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Éxito", data.mensaje, "success");

      if (refrescarParams) {
        await listar(refrescarParams);
      }
    } finally {
      setLoading(false);
    }
  };

  // Eliminar producto/servicio
  const eliminar = async (id: number, refrescarParams?: ListarParams) => {
    const result = await Swal.fire({
      title: "¿Eliminar producto/servicio?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    setLoading(true);
    try {
      const { data } = await productosServiciosApi.eliminar(id);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Éxito", data.mensaje, "success");

      if (refrescarParams) {
        await listar(refrescarParams);
      }
    } finally {
      setLoading(false);
    }
  };

  // Desactivar producto/servicio
  const desactivar = async (id: number, refrescarParams?: ListarParams) => {
    const result = await Swal.fire({
      title: "¿Desactivar/Activar producto/servicio?",
      text: "El producto/servicio dejará de estar activo, pero no se eliminará.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar/activar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;
    setLoading(true);
    try {
      const { data } = await productosServiciosApi.desactivar(id);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Éxito", data.mensaje, "success");

      if (refrescarParams) {
        await listar(refrescarParams);
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al desactivar el producto/servicio",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  // Obtener producto/servicio por ID
  const obtenerPorId = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const { data } = await productosServiciosApi.getById(id);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return null;
      }

      return data.respuesta;
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
