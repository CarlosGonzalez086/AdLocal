import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import { productosServiciosApi, type ProductoServicioDto } from "../services/productosServiciosApi";

interface ListarParams {
  page: number;
  rows: number;
  orderBy: string;
  search: string;
}

export const useProductosServicios = () => {
  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Listar paginados
  const listar = useCallback(
    async ({ page, rows, orderBy, search }: ListarParams) => {
      setLoading(true);
      try {
        const { data } = await productosServiciosApi.getAllPaged({
          page: page + 1,
          pageSize: rows,
          orderBy,
          search,
        });
        

        setProductos(data.respuesta.items ?? []);
        setTotal(data.respuesta.totalItems ?? 0);
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error",
          "No se pudo cargar la información de los productos y servicios",
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Listar todos de un comercio específico
  const listarPorComercio = useCallback(async (idComercio: number) => {
    setLoading(true);
    try {
      const { data } = await productosServiciosApi.getAllByComercio(idComercio);
      setProductos(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo cargar los productos y servicios del comercio",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear o actualizar producto/servicio
  const guardar = async (
    producto: ProductoServicioDto,
    refrescarParams?: ListarParams
  ): Promise<void> => {
    setLoading(true);
    try {
      if (producto.id) {
        await productosServiciosApi.actualizar(producto.id, producto);
        Swal.fire("Actualizado", "Producto/Servicio actualizado", "success");
      } else {
        await productosServiciosApi.crear(producto);
        Swal.fire("Creado", "Producto/Servicio creado", "success");
      }

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
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await productosServiciosApi.eliminar(id);
      Swal.fire("Eliminado", "Producto/Servicio eliminado", "success");

      if (refrescarParams) {
        await listar(refrescarParams);
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo eliminar el producto/servicio",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  // Desactivar producto/servicio
  const desactivar = async (id: number, refrescarParams?: ListarParams) => {
    try {
      setLoading(true);
      await productosServiciosApi.desactivar(id);
      Swal.fire("Desactivado", "Producto/Servicio desactivado", "success");

      if (refrescarParams) {
        await listar(refrescarParams);
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo desactivar el producto/servicio",
        "error"
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
      return data.respuesta ?? null;
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo obtener la información del producto/servicio",
        "error"
      );
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
