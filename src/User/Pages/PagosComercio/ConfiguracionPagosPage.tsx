import { useEffect, useState } from "react";

import ComercioSelector from "../../../components/Comercio/ComercioSelector";
import { comercioApi } from "../../../services/comercioApi";
import { useConfiguracionPagoComercio } from "../../../hooks/useConfiguracionPagoComercio";
import { useCuentasBancariasComercio } from "../../../hooks/useCuentasBancariasComercio";
import { MetodosPagoComercio } from "./Components/MetodosPagoComercio";
import { CuentasBancariasComercio } from "./Components/CuentasBancariasComercio";

export const ConfiguracionPagosPage = () => {
  const [comercios, setComercios] = useState<{ id: number; nombre: string }[]>([]);
  const [selectedComercioId, setSelectedComercioId] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    comercioApi
      .getAllComerciosByUser(1, 20)
      .then(({ data }) => {
        const items = data?.respuesta?.items ?? [];
        if (!mounted || items.length === 0) return;
        setComercios(items.map((c) => ({ id: c.id, nombre: c.nombre })));
        setSelectedComercioId((prev) => (prev > 0 ? prev : items[0].id));
      })
      .catch(() => {
        // Fallback al comercio principal del JWT si falla el selector
      });
    return () => {
      mounted = false;
    };
  }, []);

  const comercioActivo = selectedComercioId > 0 ? selectedComercioId : undefined;

  const {
    configuracion,
    loading: loadingConfiguracion,
    obtener,
    guardar,
  } = useConfiguracionPagoComercio(comercioActivo);

  const {
    cuentas,
    loading: loadingCuentas,
    listar,
    crear,
    actualizar,
    eliminar,
    establecerPrincipal,
  } = useCuentasBancariasComercio(comercioActivo);

  useEffect(() => {
    void obtener();
    void listar();
  }, [obtener, listar]);

  return (
    <div className="w-100">
      {comercios.length > 1 && (
        <div className="mb-4">
          <ComercioSelector
            comercios={comercios}
            value={selectedComercioId}
            onChange={setSelectedComercioId}
          />
        </div>
      )}

      <div className="row g-4">
        <div className="col-12">
          <MetodosPagoComercio
            configuracion={configuracion}
            loading={loadingConfiguracion}
            onGuardar={guardar}
          />
        </div>

        <div className="col-12">
          <CuentasBancariasComercio
            cuentas={cuentas}
            loading={loadingCuentas}
            onCrear={crear}
            onActualizar={actualizar}
            onEliminar={eliminar}
            onPrincipal={establecerPrincipal}
          />
        </div>
      </div>
    </div>
  );
};
