import {
  Button,
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
    <div className="card-adlocal h-100 d-flex flex-column">
      <ConfigFormHeader
        icon={<MaterialSymbol icon="percent" size="medium" filled />}
        title="Comisión de ADLocal"
        subtitle="Configura la comisión cobrada por cada pedido"
        badgeColor="teal"
        action={
          <span
            className={`badge-adlocal ${
              form.activa ? "badge-adlocal--primary" : "bg-light text-muted border"
            }`}
          >
            <MaterialSymbol
              icon={form.activa ? "check_circle" : "pause_circle"}
              size="small"
            />
            {form.activa ? "Activa" : "Pausada"}
          </span>
        }
      />

      {loading && <LinearProgress />}

      <div className="card-adlocal-body flex-grow-1 d-flex flex-column justify-content-between">
        <div className="d-flex flex-column gap-3">
          {/* INFORMACIÓN */}
          <div className="config-info-box">
            <div
              className="config-icon-badge config-icon-badge--teal"
              style={{ width: 36, height: 36 }}
            >
              <MaterialSymbol icon="payments" size="small" />
            </div>
            <div>
              <h3 className="fz-h4 fw-semibold mb-1" style={{ color: "#1C1C1E" }}>
                Comisión comercial por venta
              </h3>
              <p className="fz-body text-secondary mb-0">
                Este porcentaje y monto fijo se aplicarán a cada pedido confirmado dentro de la plataforma ADLocal.
              </p>
            </div>
          </div>

          {/* CAMPOS LADO A LADO */}
          <div className="row g-3">
            <div className="col-12 col-sm-6">
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

            <div className="col-12 col-sm-6">
              <TextField
                label="Comisión fija (MXN)"
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

          {/* ACTIVAR COMISIÓN */}
          <div className="config-toggle-card">
            <div className="d-flex align-items-center gap-2">
              <MaterialSymbol
                icon={form.activa ? "check_circle" : "pause_circle"}
                size="medium"
                style={{ color: form.activa ? "#008989" : "#8E8E93" }}
              />
              <div>
                <strong className="fz-h4 fw-semibold d-block">
                  Estado de la comisión
                </strong>
                <span className="fz-body text-secondary">
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
              color="primary"
            />
          </div>

          {/* EJEMPLO / SIMULADOR */}
          <div className="config-simulation-card">
            <div className="d-flex align-items-center justify-content-center gap-1 mb-1 text-secondary">
              <MaterialSymbol icon="calculate" size="small" />
              <span className="fz-h5 fw-medium">
                Simulación sobre una orden de $1,000.00 MXN
              </span>
            </div>

            <div className="fz-h2 fw-bold" style={{ color: "#008989" }}>
              $
              {(
                1000 * (Math.max(porcentajeNumero || 0, 0) / 100) +
                Math.max(montoFijoNumero || 0, 0)
              ).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="fz-body fw-regular text-secondary">MXN</span>
            </div>

            <span className="fz-body text-secondary" style={{ fontSize: "12px" }}>
              {porcentajeNumero > 0
                ? `${porcentajeNumero}% ($${(
                    (1000 * porcentajeNumero) /
                    100
                  ).toFixed(2)})`
                : "0%"}
              {montoFijoNumero > 0
                ? ` + $${montoFijoNumero.toFixed(2)} fijo`
                : ""}
            </span>
          </div>
        </div>

        <div className="pt-3 mt-3 border-top">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isDisabled}
            className="btn-adlocal btn-adlocal--solid w-100"
          >
            <MaterialSymbol icon="save" size="small" />
            <span className="ms-2">Guardar comisión</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
