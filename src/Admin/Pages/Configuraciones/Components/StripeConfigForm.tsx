import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Divider,
  InputAdornment,
  LinearProgress,
  Box,
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
    <div className="card-adlocal">
      <ConfigFormHeader
        icon={<MaterialSymbol icon="credit_card" size="medium" filled />}
        title="Configuración de Stripe"
        subtitle="Claves de integración y comisiones de pago"
      />

      <Divider />

      {loading && <LinearProgress />}

      <Box className="config-form-body">
        <Box className="config-form-content">
          <Stack spacing={2.5}>
            <TextField
              label="Publishable Key"
              name="publishableKey"
              value={form.publishableKey}
              onChange={onChange}
              fullWidth
              disabled={loading}
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MaterialSymbol icon="lock" size="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Secret Key"
              name="secretKey"
              value={form.secretKey}
              onChange={onChange}
              fullWidth
              disabled={loading}
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MaterialSymbol icon="lock" size="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Divider />

            <TextField
              label="Comisión porcentual"
              name="commissionPercentage"
              value={form.commissionPercentage}
              onChange={onChange}
              type="number"
              fullWidth
              disabled={loading}
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MaterialSymbol icon="percent" size="small" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Comisión fija"
              name="commissionFixed"
              value={form.commissionFixed}
              onChange={onChange}
              type="number"
              fullWidth
              disabled={loading}
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MaterialSymbol icon="attach_money" size="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              onClick={onSubmit}
              disabled={isDisabled}
              className="btn-adlocal btn-adlocal--solid config-form-submit fz-h4 fw-semibold"
            >
              Guardar configuración
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};
