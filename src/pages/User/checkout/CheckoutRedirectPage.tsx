// CheckoutRedirectPage.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { CircularProgress, Stack, Typography, Box } from "@mui/material";
import { checkoutApi } from "../../../services/checkoutApi";

export const CheckoutRedirectPage = () => {
  const { state } = useLocation();

  useEffect(() => {
    if (!state) return;

    checkoutApi
      .crearSesion(state)
      .then((res) => {
        const url = (res as any)?.data?.url ?? (res as any)?.url;
        if (url) {
          window.location.href = url;
        } else {
          console.error("No URL returned from crearSesion:", res);
        }
      })
      .catch((err) => {
        console.error("Error al crear sesión de Stripe:", err);
      });
  }, [state]);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={3}
      sx={{
        minHeight: '80vh',
        px: 2,
        backgroundColor: '#f7f8fa',
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
        <CircularProgress size={64} color="inherit" />
      </Box>

      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          color: '#333',
          textAlign: 'center',
        }}
      >
        Preparando tu pago...
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#666',
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        Serás redirigido a la pasarela de pagos de forma segura. Esto puede tardar unos segundos.
      </Typography>
    </Stack>
  );
};
