import { Button } from "@mui/material";

import { useState } from "react";

import { CuentasBancariasTable } from "./CuentasBancariasTable";

import { CuentaBancariaModal } from "./CuentaBancariaModal";
import type {
  CuentaBancariaComercioCreateDto,
  CuentaBancariaComercioDto,
  CuentaBancariaComercioUpdateDto,
} from "../../../../types/User/pagosComercio";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import type { ModalActionResult } from "../../../../hooks/useCuentasBancariasComercio";

interface Props {
  cuentas: CuentaBancariaComercioDto[];

  loading: boolean;

  onCrear: (dto: CuentaBancariaComercioCreateDto) => Promise<ModalActionResult>;

  onActualizar: (
    uuid: string,
    dto: CuentaBancariaComercioUpdateDto,
  ) => Promise<ModalActionResult>;

  onEliminar: (cuenta: CuentaBancariaComercioDto) => void;

  onPrincipal: (cuenta: CuentaBancariaComercioDto) => void;
}

export const CuentasBancariasComercio = ({
  cuentas,
  loading,

  onCrear,
  onActualizar,
  onEliminar,
  onPrincipal,
}: Props) => {
  const [open, setOpen] = useState(false);

  const [cuentaSeleccionada, setCuentaSeleccionada] =
    useState<CuentaBancariaComercioDto | null>(null);

  const abrirNueva = () => {
    setCuentaSeleccionada(null);

    setOpen(true);
  };

  const abrirEditar = (cuenta: CuentaBancariaComercioDto) => {
    setCuentaSeleccionada(cuenta);

    setOpen(true);
  };

  const cerrar = () => {
    if (loading) {
      return;
    }

    setOpen(false);

    setCuentaSeleccionada(null);
  };

  return (
    <>
      <div className="cuentasBancariasCard">
        <div className="p-3 p-md-4">
          <div className="row g-3 align-items-center mb-4">
            <div className="col-12 col-md">
              <div className="d-flex align-items-center gap-3">
                <div className="pagoComercioHeaderIcon d-flex align-items-center justify-content-center flex-shrink-0">
                  <MaterialSymbol icon="account_balance" size="medium" filled />
                </div>

                <div>
                  <h2 className="fz-h3 fw-bold mb-1">Cuentas bancarias</h2>

                  <p className="pagoComercioDescription fz-h5 fw-regular mb-0">
                    Administra las cuentas que mostrarás para transferencias.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-auto">
              <Button
                type="button"
                fullWidth
                className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold"
                onClick={abrirNueva}
              >
                <MaterialSymbol icon="add" size="small" />

                <span className="ms-2">Nueva cuenta</span>
              </Button>
            </div>
          </div>

          <CuentasBancariasTable
            cuentas={cuentas}
            loading={loading}
            onEditar={abrirEditar}
            onEliminar={onEliminar}
            onPrincipal={onPrincipal}
          />
        </div>
      </div>

      {open && (
        <CuentaBancariaModal
          key={cuentaSeleccionada?.uuid ?? "new"}
          open={open}
          cuenta={cuentaSeleccionada}
          loading={loading}
          onClose={cerrar}
          onCrear={onCrear}
          onActualizar={onActualizar}
        />
      )}
    </>
  );
};
