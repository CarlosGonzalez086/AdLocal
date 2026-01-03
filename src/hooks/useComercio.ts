import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { comercioApi, type ComercioDto } from "../services/comercioApi";

export const useComercio = () => {
  const [comercio, setComercio] = useState<ComercioDto | null>(null);
  const [loading, setLoading] = useState(false);

  const cargar = async () => {
    try {
      setLoading(true);
      const { data } = await comercioApi.getMine();
      setComercio(data.respuesta ?? null);
    } catch {
      setComercio(null);
    } finally {
      setLoading(false);
    }
  };

  const guardar = async (data: ComercioDto) => {
    setLoading(true);
    try {
      if (comercio?.id) {
        await comercioApi.actualizar(comercio.id, data);
        Swal.fire("Actualizado", "Comercio actualizado", "success");
      } else {
        await comercioApi.crear(data);
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
