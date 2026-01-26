import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  LinearProgress,
  Box,
} from "@mui/material";
import { useConfiguracionSistema } from "../../../../hooks/useConfiguracionSistema";

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

  /* =========================
     Cargar configuración
     ========================= */
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

  /* =========================
     Handlers
     ========================= */
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

  /* =========================
     Render
     ========================= */
  return (
    <Card elevation={3}>
      <CardHeader
        title="Configuración de Stripe"
        subheader="Claves y comisiones de pago"
      />
      <Divider />

      {loading && <LinearProgress />}

      <CardContent>
        <Box sx={{ maxWidth: 600, mx: "auto" }}>
          <Stack spacing={2}>
            <TextField
              label="Publishable Key"
              name="publishableKey"
              value={form.publishableKey}
              onChange={onChange}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Secret Key"
              name="secretKey"
              value={form.secretKey}
              onChange={onChange}
              fullWidth
              disabled={loading}
            />

            <TextField
              label="Comisión (%)"
              name="commissionPercentage"
              value={form.commissionPercentage}
              onChange={onChange}
              type="number"
              fullWidth
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">%</InputAdornment>
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
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              onClick={onSubmit}
              disabled={isDisabled}
              size="large"
            >
              Guardar configuración Stripe
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
