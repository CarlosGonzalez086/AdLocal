import { useState, useEffect, useContext } from "react";
import Swal from "sweetalert2";
import { comercioApi, type ComercioDto } from "../services/comercioApi";
import { useActualizarJwt } from "./useActualizarJwt";
import { UserContext } from "../context/UserContext ";
import type { ComercioCreateDto } from "../schemas/comercioCreate.schema";

export const useComercio = () => {
  const user = useContext(UserContext);
  const { actualizarJwt } = useActualizarJwt();
  const [comercio, setComercio] = useState<ComercioDto | null>(null);
  const [loading, setLoading] = useState(false);

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
      if (comercio?.id) {
        const { data: resp } = await comercioApi.actualizar(comercio.id, {
          ...data,
          activo: comercio.activo,
        });

        if (resp.codigo !== "200") {
          Swal.fire("Error", resp.mensaje, "error");
          return;
        }

        Swal.fire("Actualizado", resp.mensaje, "success");
      } else {
        const { data: resp } = await comercioApi.crear(data);

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

  useEffect(() => {
    cargar();
  }, []);

  return {
    comercio,
    loading,
    guardar,
    eliminar,
  };
};
