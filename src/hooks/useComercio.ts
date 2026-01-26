import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import {
  comercioApi,
  comercioDtoDefault,
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

export interface ListarParamsComercio {
  page: number;
  rowsPerPage: number;
}

export const useComercio = () => {
  const user = useContext(UserContext);
  const navigate = useNavigate();
  const { actualizarJwt } = useActualizarJwt();
  const [comercio, setComercio] = useState<ComercioDto | null>(null);
  const [comercioPage, setComercioPage] =
    useState<ComercioDto>(comercioDtoDefault);
  const [comercios, setComercios] = useState<ComercioDtoListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [totalByUser, setTotalByUser] = useState(0);

  const cargar = async () => {
    setLoading(true);
    try {
      const { data } = await comercioApi.getMine();
      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        setComercio(null);
        return;
      }

      const c = data.respuesta;
      if (!c) {
        setComercio(null);
        return;
      }
      setComercio(c);
    } catch (error) {
      console.error(error);
      setComercio(null);
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

        const { data: resp } = await comercioApi.actualizar({ ...result.data, id: comercio.id });

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
      setComercio(null);
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

        const { data: resp } = await comercioApi.actualizar({ ...result.data, id: comercioPage.id });

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
  };
};
