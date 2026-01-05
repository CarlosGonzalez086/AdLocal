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
} from "@mui/material";
import { useConfiguracionSistema } from "../../../../hooks/useConfiguracionSistema";


export const StripeConfigForm = () => {
  const { cargar, guardarStripe, configuraciones, loading } =
    useConfiguracionSistema();

  const [form, setForm] = useState({
    publishableKey: "",
    secretKey: "",
    commissionPercentage: "",
    commissionFixed: "",
  });

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    const getVal = (key: string) =>
      Array.isArray(configuraciones)
        ? configuraciones.find((x) => x.key === key)?.val ?? ""
        : "";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      publishableKey: getVal("STRIPE_PUBLISHABLE_KEY"),
      secretKey: getVal("STRIPE_SECRET_KEY"),
      commissionPercentage: getVal("STRIPE_COMMISSION_PERCENTAGE"),
      commissionFixed: getVal("STRIPE_COMMISSION_FIXED"),
    });
  }, [configuraciones]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = () => guardarStripe(form);

  return (
    <Card elevation={3}>
      <CardHeader
        title="Configuración de Stripe"
        subheader="Claves y comisiones de pago"
      />
      <Divider />
      <CardContent>
        {loading ? (
          <>
            {" "}
            <LinearProgress />
          </>
        ) : (
          <>
            {" "}
            <Stack spacing={2}>
              <TextField
                label="Publishable Key"
                name="publishableKey"
                value={form.publishableKey}
                onChange={onChange}
                fullWidth
              />

              <TextField
                label="Secret Key"
                name="secretKey"
                value={form.secretKey}
                onChange={onChange}
                fullWidth
              />

              <TextField
                label="Comisión (%)"
                name="commissionPercentage"
                value={form.commissionPercentage}
                onChange={onChange}
                fullWidth
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Comisión fija"
                name="commissionFixed"
                value={form.commissionFixed}
                onChange={onChange}
                fullWidth
                type="number"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />

              <Button variant="contained" onClick={onSubmit} disabled={loading}>
                Guardar configuración Stripe
              </Button>
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};
