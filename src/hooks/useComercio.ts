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
    try {
      setLoading(true);

      const { data } = await comercioApi.getMine();
      const c = data.respuesta;
      console.log(c);

      if (!c) {
        setComercio(null);
        return;
      }

      setComercio({
        id: c.id,
        nombre: c.nombre,
        direccion: c.direccion,
        telefono: c.telefono,
        activo: c.activo,
        logoBase64: c.logoBase64,
        lat: c.lat,
        lng: c.lng,
      });
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
        await comercioApi.actualizar(comercio.id, {
          ...data,
          activo: comercio.activo,
        });
        Swal.fire("Actualizado", "Comercio actualizado", "success");
      } else {
        await comercioApi.crear(data);
        await actualizarJwt({
          email: user.sub,
          updateJWT: true,
        });
        Swal.fire("Creado", "Comercio registrado", "success");
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

    await comercioApi.eliminar(comercio.id);
    Swal.fire("Eliminado", "Comercio eliminado", "success");
    window.location.reload();
    setComercio(null);
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
