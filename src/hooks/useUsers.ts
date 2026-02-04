import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  usersService,
  type UsuarioConSuscripcionDto,
} from "../services/usersApi";

interface ListarParams {
  page: number;
  rows: number;
  orderBy: "recent" | "old" | "az" | "za";
  search: string;
}

export const useUsers = () => {
  const [users, setUsers] = useState<UsuarioConSuscripcionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const listar = useCallback(
    async ({ page, rows, orderBy, search }: ListarParams) => {
      setLoading(true);
      try {
        const resp = await usersService.getAll({
          page: page + 1,
          pageSize: rows,
          orderBy,
          search,
        });

        setUsers(resp.data.respuesta.data);
        setTotal(resp.data.respuesta.totalRecords);
      } catch (error) {
        console.error(error);
        Swal.fire(
          "Error al cargar usuarios",
          "Ocurrió un problema al obtener la información. Intenta nuevamente.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const eliminar = async (id: number, refrescarParams: ListarParams) => {
    const result = await Swal.fire({
      title: "Confirmar baja de usuario",
      text: "El usuario será dado de baja y no podrá acceder al sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, dar de baja",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await usersService.eliminar(id);

      Swal.fire(
        "Usuario dado de baja",
        "La operación se realizó correctamente.",
        "success",
      );

      listar(refrescarParams);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "No se pudo dar de baja",
        "Ocurrió un error al intentar eliminar el usuario. Intenta más tarde.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    total,
    loading,
    listar,
    eliminar,
  };
};
