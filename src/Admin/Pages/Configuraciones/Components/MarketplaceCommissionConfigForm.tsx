import {
  Button,
  Divider,
  InputAdornment,
  LinearProgress,
  Switch,
  TextField,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useConfiguracionSistema } from "../../../../hooks/useConfiguracionSistema";

import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

import { ConfigFormHeader } from "./ConfigFormHeader";

interface MarketplaceCommissionFormState {
  porcentaje: string;

  montoFijo: string;

  activa: boolean;
}

export const MarketplaceCommissionConfigForm = () => {
  const {
    cargar,

    guardarComisionMarketplace,

    configuraciones,

    loading,
  } = useConfiguracionSistema();

  const [form, setForm] = useState<MarketplaceCommissionFormState>({
    porcentaje: "10",

    montoFijo: "0",

    activa: true,
  });

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useEffect(() => {
    if (!Array.isArray(configuraciones)) {
      return;
    }

    const getValue = (key: string) =>
      configuraciones.find((x) => x.key === key)?.val ?? "";

    const porcentaje = getValue("MARKETPLACE_COMMISSION_PERCENTAGE");

    const montoFijo = getValue("MARKETPLACE_COMMISSION_FIXED");

    const activa = getValue("MARKETPLACE_COMMISSION_ENABLED");

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      porcentaje: porcentaje || "10",

      montoFijo: montoFijo || "0",

      activa: activa ? activa.toLowerCase() === "true" : true,
    });
  }, [configuraciones]);

  const handlePorcentajeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((current) => ({
      ...current,

      porcentaje: event.target.value,
    }));
  };

  const handleMontoFijoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setForm((current) => ({
      ...current,

      montoFijo: event.target.value,
    }));
  };

  const handleActivaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((current) => ({
      ...current,

      activa: event.target.checked,
    }));
  };

  const onSubmit = async () => {
    const porcentaje = Number(form.porcentaje);

    const montoFijo = Number(form.montoFijo);

    if (Number.isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) {
      return;
    }

    if (Number.isNaN(montoFijo) || montoFijo < 0) {
      return;
    }

    await guardarComisionMarketplace({
      porcentaje,

      montoFijo,

      activa: form.activa,
    });
  };

  const porcentajeNumero = Number(form.porcentaje);

  const montoFijoNumero = Number(form.montoFijo);

  const isDisabled =
    loading ||
    !form.porcentaje ||
    Number.isNaN(porcentajeNumero) ||
    porcentajeNumero < 0 ||
    porcentajeNumero > 100 ||
    Number.isNaN(montoFijoNumero) ||
    montoFijoNumero < 0;

  return (
    <div className="card-adlocal">
      <ConfigFormHeader
        icon={<MaterialSymbol icon="percent" size="medium" filled />}
        title="Comisión de ADLocal"
        subtitle="Configura la comisión cobrada por cada pedido"
      />

      <Divider />

      {loading && <LinearProgress />}

      <div className="p-3 p-lg-4">
        <div className="d-flex flex-column gap-3">
          {/* INFORMACIÓN */}
          <div className="marketplaceCommissionInfo d-flex align-items-center gap-3 p-3">
            <div className="marketplaceCommissionInfoIcon d-flex align-items-center justify-content-center flex-shrink-0">
              <MaterialSymbol icon="payments" size="medium" />
            </div>

            <div>
              <strong className="fz-h4 fw-semibold">Comisión por venta</strong>

              <p className="fz-h5 fw-regular mb-0">
                Este porcentaje se aplicará a cada pedido confirmado en ADLocal.
              </p>
            </div>
          </div>

          {/* CAMPOS */}
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-12">
              <TextField
                label="Comisión porcentual"
                value={form.porcentaje}
                onChange={handlePorcentajeChange}
                type="number"
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    max: 100,
                    step: 0.01,
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="percent" size="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-12">
              <TextField
                label="Comisión fija"
                value={form.montoFijo}
                onChange={handleMontoFijoChange}
                type="number"
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: 0.01,
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="attach_money" size="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
          </div>

          <Divider />

          {/* ACTIVAR COMISIÓN */}
          <div className="marketplaceCommissionToggle d-flex align-items-center justify-content-between gap-3 p-3">
            <div className="d-flex align-items-center gap-2">
              <MaterialSymbol
                icon={form.activa ? "check_circle" : "pause_circle"}
                size="medium"
              />

              <div className="d-flex flex-column">
                <strong className="fz-h4 fw-semibold">Comisión activa</strong>

                <span className="fz-h5 fw-regular">
                  {form.activa
                    ? "ADLocal cobrará comisión en los nuevos pedidos."
                    : "Los nuevos pedidos no generarán comisión."}
                </span>
              </div>
            </div>

            <Switch
              checked={form.activa}
              onChange={handleActivaChange}
              disabled={loading}
            />
          </div>

          {/* EJEMPLO */}
          <div className="marketplaceCommissionPreview d-flex flex-column align-items-center justify-content-center text-center gap-1 p-3">
            <span className="fz-h5 fw-medium">
              Ejemplo sobre una venta de $1,000.00
            </span>

            <strong className="fz-h3 fw-bold">
              $
              {(
                1000 * (Math.max(porcentajeNumero || 0, 0) / 100) +
                Math.max(montoFijoNumero || 0, 0)
              ).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </strong>

            <span className="fz-h6 fw-regular">
              Comisión estimada de ADLocal
            </span>
          </div>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isDisabled}
            className="btn-adlocal btn-adlocal--solid config-form-submit fz-h4 fw-semibold w-100"
          >
            <MaterialSymbol icon="save" size="small" />

            <span className="ms-2">Guardar comisión</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
