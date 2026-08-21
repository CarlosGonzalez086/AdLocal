import { useEffect } from "react";

import { useConfiguracionPagoComercio } from "../../../hooks/useConfiguracionPagoComercio";

import { useCuentasBancariasComercio } from "../../../hooks/useCuentasBancariasComercio";
import { MetodosPagoComercio } from "./Components/MetodosPagoComercio";
import { CuentasBancariasComercio } from "./Components/CuentasBancariasComercio";

export const ConfiguracionPagosPage = () => {
  const {
    configuracion,

    loading: loadingConfiguracion,

    obtener,

    guardar,
  } = useConfiguracionPagoComercio();

  const {
    cuentas,

    loading: loadingCuentas,

    listar,

    crear,

    actualizar,

    eliminar,

    establecerPrincipal,
  } = useCuentasBancariasComercio();

  useEffect(() => {
    void obtener();

    void listar();
  }, [obtener, listar]);

  return (
    <div className="w-100">
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
