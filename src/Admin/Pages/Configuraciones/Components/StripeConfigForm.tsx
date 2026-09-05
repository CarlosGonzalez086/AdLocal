import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  LinearProgress,
  IconButton,
} from "@mui/material";
import { useConfiguracionSistema } from "../../../../hooks/useConfiguracionSistema";
import { ConfigFormHeader } from "./ConfigFormHeader";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

interface StripeFormState {
  publishableKey: string;
  secretKey: string;
  commissionPercentage: string;
  commissionFixed: string;
}

export const StripeConfigForm = () => {
  const { cargar, guardarStripe, configuraciones, loading } =
    useConfiguracionSistema();

  const [form, setForm] = useState<StripeFormState>({
    publishableKey: "",
    secretKey: "",
    commissionPercentage: "",
    commissionFixed: "",
  });

  const [showSecretKey, setShowSecretKey] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    if (!Array.isArray(configuraciones)) return;

    const getValue = (key: string) =>
      configuraciones.find((x) => x.key === key)?.val ?? "";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      publishableKey: getValue("STRIPE_PUBLISHABLE_KEY"),
      secretKey: getValue("STRIPE_SECRET_KEY"),
      commissionPercentage: getValue("STRIPE_COMMISSION_PERCENTAGE"),
      commissionFixed: getValue("STRIPE_COMMISSION_FIXED"),
    });
  }, [configuraciones]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    guardarStripe(form);
  };

  const isDisabled =
    loading ||
    !form.publishableKey ||
    !form.secretKey ||
    Number(form.commissionPercentage) < 0 ||
    Number(form.commissionFixed) < 0;

  return (
    <div className="card-adlocal h-100 d-flex flex-column">
      <ConfigFormHeader
        icon={<MaterialSymbol icon="credit_card" size="medium" filled />}
        title="Pasarela de Pagos Stripe"
        subtitle="Claves de integración y comisiones de pasarela"
        badgeColor="teal"
        action={
          <span className="badge-adlocal badge-adlocal--primary">
            <MaterialSymbol icon="verified_user" size="small" />
            Stripe API
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
              <MaterialSymbol icon="shield_lock" size="small" />
            </div>
            <div>
              <h3 className="fz-h4 fw-semibold mb-1" style={{ color: "#1C1C1E" }}>
                Integración de Pagos en Línea
              </h3>
              <p className="fz-body text-secondary mb-0">
                Permite a los comercios cobrar pedidos con tarjeta de crédito/débito y transferencias bancarias.
              </p>
            </div>
          </div>

          {/* CLAVES DE STRIPE */}
          <div className="row g-3">
            <div className="col-12">
              <TextField
                label="Publishable Key (pk_...)"
                name="publishableKey"
                value={form.publishableKey}
                onChange={onChange}
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="key" size="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="col-12">
              <TextField
                label="Secret Key (sk_...)"
                name="secretKey"
                type={showSecretKey ? "text" : "password"}
                value={form.secretKey}
                onChange={onChange}
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="lock" size="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowSecretKey((prev) => !prev)}
                          edge="end"
                          tabIndex={-1}
                        >
                          <MaterialSymbol
                            icon={showSecretKey ? "visibility_off" : "visibility"}
                            size="small"
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            {/* COMISIONES STRIPE LADO A LADO */}
            <div className="col-12 col-sm-6">
              <TextField
                label="Comisión porcentual"
                name="commissionPercentage"
                value={form.commissionPercentage}
                onChange={onChange}
                type="number"
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
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
                name="commissionFixed"
                value={form.commissionFixed}
                onChange={onChange}
                type="number"
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
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
        </div>

        <div className="pt-3 mt-3 border-top">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isDisabled}
            className="btn-adlocal btn-adlocal--solid w-100"
          >
            <MaterialSymbol icon="save" size="small" />
            <span className="ms-2">Guardar configuración</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
