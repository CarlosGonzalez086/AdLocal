import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  LinearProgress,
  Box,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PercentIcon from "@mui/icons-material/Percent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";

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
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <CreditCardIcon color="primary" />
          <Box>
            <Typography fontWeight={600} fontSize={18}>
              Configuración de Stripe
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Claves de integración y comisiones de pago
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {loading && <LinearProgress />}

      <CardContent>
        <Box sx={{ maxWidth: 520, mx: "auto" }}>
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
                    <LockIcon fontSize="small" />
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
                    <LockIcon fontSize="small" />
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
                    <PercentIcon fontSize="small" />
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
                    <AttachMoneyIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={onSubmit}
              disabled={isDisabled}
              sx={{
                mt: 1,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                py: 1.3,
              }}
            >
              Guardar configuración
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
