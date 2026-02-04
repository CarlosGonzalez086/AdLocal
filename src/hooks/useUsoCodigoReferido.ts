import { useCallback, useState } from "react";
import Swal from "sweetalert2";
import { usoCodigoReferidoService } from "../services/usoCodigoReferido.api";


export const useUsoCodigoReferido = () => {
  const [misUsos, setMisUsos] = useState<number>(0);
  const [totalUsos, setTotalUsos] = useState<number>(0);
  const [loading, setLoading] = useState(false);


  const cargarMisUsos = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await usoCodigoReferidoService.misUsos();
      setMisUsos(Number(resp.data.respuesta));
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo obtener el uso de tu código referido",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const cargarTotalUsos = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await usoCodigoReferidoService.totalUsos();
      setTotalUsos(Number(resp.data.respuesta));
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "No se pudo obtener el total de usos de códigos referidos",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  

  const contarPorCodigo = async (codigo: string): Promise<number> => {
    const resp = await usoCodigoReferidoService.contarPorCodigo(codigo);
    return Number(resp.data.respuesta);
  };

  return {
    misUsos,
    totalUsos,
    loading,
    cargarMisUsos,
    cargarTotalUsos,
    contarPorCodigo,
  };
};
