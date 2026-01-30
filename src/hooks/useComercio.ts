import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import {
  comercioApi,
  comercioDtoDefault,
  type ColaborarDto,
  type ComercioDto,
  type ComercioDtoListItem,
} from "../services/comercioApi";
import { useActualizarJwt } from "./useActualizarJwt";

import {
  comercioCreateSchema,
  comercioUpdateSchema,
  type ComercioCreateDto,
} from "../schemas/comercioCreate.schema";
import { normalizeComercioData } from "../utils/generalsFunctions";
import { UserContext } from "../context/UserContext ";
import { useNavigate } from "react-router-dom";
import type { ProfileUser } from "../services/userProfileApi";

export interface ListarParamsComercio {
  page: number;
  rowsPerPage: number;
}
export interface ListarParamsColaboradores {
  idComercio: number;
  page: number;
  rowsPerPage: number;
}

export const useComercio = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const { actualizarJwt } = useActualizarJwt();
  const [comercio, setComercio] = useState<ComercioDto>(comercioDtoDefault);
  const [comercioPage, setComercioPage] =
    useState<ComercioDto>(comercioDtoDefault);
  const [comercios, setComercios] = useState<ComercioDtoListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalByUser, setTotalByUser] = useState(0);
  const [usersColaboradores, setUsersColaboradores] = useState<ProfileUser[]>(
    [],
  );
  const [totalColaboradores, setTotalColaboradores] = useState(0);

  const cargar = async () => {
    setLoading(true);
    try {
      const { data } = await comercioApi.getMine();
      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        setComercio(comercioDtoDefault);
        return;
      }

      const c = data.respuesta;
      if (!c) {
        setComercio(comercioDtoDefault);
        return;
      }
      setComercio(c);
    } catch (error) {
      console.error(error);
      setComercio(comercioDtoDefault);
    } finally {
      setLoading(false);
    }
  };

  const guardar = async (data: ComercioCreateDto) => {
    setLoading(true);

    try {
      const normalizedData = normalizeComercioData(data);

      if (comercio?.id) {
        const result = comercioUpdateSchema.safeParse({
          ...normalizedData,
          activo: comercio.activo,
        });

        if (!result.success) {
          Swal.fire(
            "Validación",
            result.error.issues.map((e) => e.message).join("\n"),
            "warning",
          );
          return;
        }

        const { data: resp } = await comercioApi.actualizar({
          ...result.data,
          id: comercio.id,
        });
        console.log(resp);

        if (resp.codigo !== "200") {
          Swal.fire("Error", resp.mensaje, "error");
          return;
        }

        Swal.fire("Actualizado", resp.mensaje, "success");
      } else {
        const result = comercioCreateSchema.safeParse(normalizedData);

        if (!result.success) {
          Swal.fire(
            "Validación",
            result.error.issues.map((e) => e.message).join("\n"),
            "warning",
          );
          return;
        }

        const { data: resp } = await comercioApi.crear(result.data);

        if (resp.codigo !== "200") {
          Swal.fire("Error", resp.mensaje, "error");
          return;
        }

        await actualizarJwt({
          email: user.sub,
          updateJWT: true,
        });

        Swal.fire("Creado", resp.mensaje, "success");
      }

      await cargar();
    } catch (error: any) {
      Swal.fire("Error", error.response.data.mensaje, "error");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async () => {
    if (!comercio?.id) return;

    const r = await Swal.fire({
      title: "¿Eliminar comercio?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      reverseButtons: true,
    });

    if (!r.isConfirmed) return;

    setLoading(true);
    try {
      const { data } = await comercioApi.eliminar(comercio.id);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Eliminado", data.mensaje, "success");
      setComercio(comercioDtoDefault);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const getAllComerciosByUser = async (page: number, rowsPerPage: number) => {
    setLoading(true);

    try {
      const { data } = await comercioApi.getAllComerciosByUser(
        page + 1,
        rowsPerPage,
      );

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        setComercios([]);
        setTotal(0);
        return;
      }

      setComercios(data.respuesta.items || []);
      setTotal(data.respuesta.totalItems || 0);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los comercios", "error");
      setComercios([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const cargarPorId = async (id: number) => {
    setLoading(true);
    try {
      const { data } = await comercioApi.getById(id);

      if (data.codigo != "200") {
        Swal.fire("Error", data.mensaje, "error");
        setComercioPage(comercioDtoDefault);
        return;
      }
      console.log(data.respuesta);

      setComercioPage(data.respuesta);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo cargar el comercio", "error");
      setComercioPage(comercioDtoDefault);
      return;
    } finally {
      setLoading(false);
    }
  };

  const guardarPage = async (data: ComercioCreateDto) => {
    setLoading(true);

    try {
      const normalizedData = normalizeComercioData(data);

      if (comercioPage?.id) {
        const result = comercioUpdateSchema.safeParse({
          ...normalizedData,
          activo: comercioPage.activo,
        });

        if (!result.success) {
          Swal.fire(
            "Validación",
            result.error.issues.map((e) => e.message).join("\n"),
            "warning",
          );
          return;
        }

        const { data: resp } = await comercioApi.actualizar({
          ...result.data,
          id: comercioPage.id,
        });

        if (resp.codigo !== "200") {
          Swal.fire("Error", resp.mensaje, "error");
          return;
        }

        Swal.fire("Actualizado", resp.mensaje, "success");
        navigate("/app/comercio");
      } else {
        const result = comercioCreateSchema.safeParse(normalizedData);

        if (!result.success) {
          Swal.fire(
            "Validación",
            result.error.issues.map((e) => e.message).join("\n"),
            "warning",
          );
          return;
        }

        const { data: resp } = await comercioApi.crear(result.data);

        if (resp.codigo !== "200") {
          Swal.fire("Error", resp.mensaje, "error");
          return;
        }

        Swal.fire("Creado", resp.mensaje, "success");
        navigate("/app/comercio");
      }

      await cargar();
    } finally {
      setLoading(false);
    }
  };

  const eliminarFromTable = async (
    id: number,
    refrescarParams?: ListarParamsComercio,
  ) => {
    if (!id) return;

    const r = await Swal.fire({
      title: "¿Eliminar comercio?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      reverseButtons: true,
    });

    if (!r.isConfirmed) return;

    setLoading(true);
    try {
      const { data } = await comercioApi.eliminar(id);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }
      Swal.fire("Eliminado", data.mensaje, "success");
      if (refrescarParams) {
        await getAllComerciosByUser(
          refrescarParams.page,
          refrescarParams.rowsPerPage,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getTotalComerciosByIdUsuario = async () => {
    setLoading(true);
    try {
      const { data } = await comercioApi.getTotalComerciosByIdUsuario();
      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        setTotalByUser(0);
        return;
      }

      const c = data.respuesta;
      if (!c) {
        setTotalByUser(0);
        return;
      }
      setTotalByUser(Number(c));
    } catch (error) {
      console.error(error);
      setTotalByUser(0);
    } finally {
      setLoading(false);
    }
  };

  const guardarColaborador = async (data: ColaborarDto) => {
    setLoading(true);

    try {
      const { data: resp } = await comercioApi.guardarColaborador(data);

      if (resp.codigo !== "200") {
        Swal.fire("Error", resp.mensaje, "error");
        return;
      }

      Swal.fire("Creado", resp.mensaje, "success");

      await cargar();
    } finally {
      setLoading(false);
    }
  };

  const getAllColaboradores = async (
    idComercio: number,
    page: number,
    rowsPerPage: number,
  ) => {
    setLoading(true);

    try {
      const { data } = await comercioApi.getAllColaboradores(
        idComercio,
        page + 1,
        rowsPerPage,
      );

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        setUsersColaboradores([]);
        setTotalColaboradores(0);
        return;
      }

      setUsersColaboradores(data.respuesta.items || []);
      setTotalColaboradores(data.respuesta.totalItems || 0);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudieron cargar los colaboradores", "error");
      setUsersColaboradores([]);
      setTotalColaboradores(0);
    } finally {
      setLoading(false);
    }
  };
  const toggleAccesoColaborador = async (
    idColaborador: number,
    idComercio: number,
    refrescarParams?: ListarParamsColaboradores,
  ) => {
    if (!idColaborador || !idComercio) return;

    const r = await Swal.fire({
      title: "¿Cambiar acceso del colaborador?",
      text: "Esta acción activará o desactivará su acceso al comercio.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cambiar acceso",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!r.isConfirmed) return;

    setLoading(true);
    try {
      const { data } = await comercioApi.toggleAccesoColaborador(
        idColaborador,
        idComercio,
      );

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error",);
        return;
      }

      Swal.fire("Acceso actualizado", data.mensaje, "success");
      if (refrescarParams) {
        await getAllColaboradores(
          refrescarParams.idComercio,
          refrescarParams.page,
          refrescarParams.rowsPerPage,
        );
      }
    } finally {
      setLoading(false);
    }
  };
  const eliminarColaborador = async (
    idColaborador: number,
    idComercio: number,
    refrescarParams?: ListarParamsColaboradores,
  ) => {
    if (!idColaborador || !idComercio) return;

    const r = await Swal.fire({
      title: "¿Eliminar colaborador?",
      text: "Esta acción eliminará al colaborador del comercio y no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      didOpen: () => {
        const container = Swal.getContainer();
        if (container) {
          container.style.zIndex = "2000";
        }
      },
    });

    if (!r.isConfirmed) return;

    setLoading(true);
    try {
      const { data } = await comercioApi.eliminarColaborador(
        idColaborador,
        idComercio,
      );

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      Swal.fire("Colaborador eliminado", data.mensaje, "success");
      if (refrescarParams) {
        await getAllColaboradores(
          refrescarParams.idComercio,
          refrescarParams.page,
          refrescarParams.rowsPerPage,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    getTotalComerciosByIdUsuario();
  }, []);

  return {
    comercio,
    comercios,
    loading,
    total,
    totalByUser,
    guardar,
    eliminar,
    getAllComerciosByUser,
    cargarPorId,
    guardarPage,
    eliminarFromTable,
    comercioPage,
    guardarColaborador,
    getAllColaboradores,
    usersColaboradores,
    totalColaboradores,
    toggleAccesoColaborador,
    eliminarColaborador,
  };
};
