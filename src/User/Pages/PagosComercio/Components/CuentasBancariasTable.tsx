import { Button, Tooltip } from "@mui/material";
import type { CuentaBancariaComercioDto } from "../../../../types/User/pagosComercio";
import {
  GenericTable,
  type TableColumn,
} from "../../../../components/layouts/GenericTable";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

interface Props {
  cuentas: CuentaBancariaComercioDto[];

  loading: boolean;

  onEditar: (cuenta: CuentaBancariaComercioDto) => void;

  onEliminar: (cuenta: CuentaBancariaComercioDto) => void;

  onPrincipal: (cuenta: CuentaBancariaComercioDto) => void;
}

const ocultarValor = (value: string | null) => {
  if (!value) {
    return "—";
  }

  if (value.length <= 4) {
    return value;
  }

  return `•••• ${value.slice(-4)}`;
};

export const CuentasBancariasTable = ({
  cuentas,
  loading,

  onEditar,
  onEliminar,
  onPrincipal,
}: Props) => {
  const columns: TableColumn<CuentaBancariaComercioDto>[] = [
    {
      key: "banco",
      label: "Banco",

      render: (cuenta) => (
        <div className="d-flex align-items-center gap-2">
          <div className="cuentaBancariaBankIcon d-flex align-items-center justify-content-center flex-shrink-0">
            <MaterialSymbol icon="account_balance" size="small" />
          </div>

          <span className="fz-h4 fw-semibold">{cuenta.banco}</span>
        </div>
      ),
    },

    {
      key: "beneficiario",
      label: "Beneficiario",
    },

    {
      key: "clabe",
      label: "CLABE",

      render: (cuenta) => (
        <span className="fz-h5 fw-medium">{ocultarValor(cuenta.clabe)}</span>
      ),
    },

    {
      key: "principal",
      label: "Tipo",

      render: (cuenta) =>
        cuenta.principal ? (
          <span className="cuentaBancariaPrincipal d-inline-flex align-items-center gap-1 px-2 py-1 fz-h5 fw-semibold">
            <MaterialSymbol icon="star" size="small" filled />

            <span>Principal</span>
          </span>
        ) : (
          <span className="cuentaBancariaSecondary fz-h5 fw-medium">
            Secundaria
          </span>
        ),
    },

    {
      key: "activo",
      label: "Estado",

      render: (cuenta) => (
        <span
          className={`cuentaBancariaStatus d-inline-flex align-items-center px-2 py-1 fz-h5 fw-semibold ${
            cuenta.activo
              ? "cuentaBancariaStatusActive"
              : "cuentaBancariaStatusInactive"
          }`}
        >
          {cuenta.activo ? "Activa" : "Inactiva"}
        </span>
      ),
    },
  ];

  return (
    <GenericTable<CuentaBancariaComercioDto>
      columns={columns}
      data={cuentas}
      loading={loading}
      emptyText="No hay cuentas bancarias"
      emptyDescription="Agrega una cuenta para comenzar a recibir pagos mediante transferencia."
      page={0}
      rowsPerPage={10}
      total={cuentas.length}
      rowsPerPageOptions={[10]}
      onPageChange={() => {}}
      onRowsPerPageChange={() => {}}
      getRowKey={(cuenta) => cuenta.uuid}
      actions={(cuenta) => (
        <div className="d-flex align-items-center justify-content-end gap-1">
          {!cuenta.principal && cuenta.activo && (
            <Tooltip title="Establecer como principal" arrow>
              <Button
                type="button"
                className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm cuentaBancariaIconAction"
                onClick={() => onPrincipal(cuenta)}
              >
                <MaterialSymbol icon="star" size="small" />
              </Button>
            </Tooltip>
          )}

          <Tooltip title="Editar" arrow>
            <Button
              type="button"
              className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm cuentaBancariaIconAction"
              onClick={() => onEditar(cuenta)}
            >
              <MaterialSymbol icon="edit" size="small" />
            </Button>
          </Tooltip>

          <Tooltip title="Eliminar" arrow>
            <Button
              type="button"
              className="btn-adlocal btn-adlocal--danger btn-adlocal--sm cuentaBancariaIconAction"
              onClick={() => onEliminar(cuenta)}
            >
              <MaterialSymbol icon="delete" size="small" />
            </Button>
          </Tooltip>
        </div>
      )}
    />
  );
};
