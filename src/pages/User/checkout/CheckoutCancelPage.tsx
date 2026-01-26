// CheckoutCancelPage.tsx
import { Button, Stack, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CancelIcon from '@mui/icons-material/Cancel';

export const CheckoutCancelPage = () => {
  const navigate = useNavigate();

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
          backgroundColor: '#ffe6e6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        }}
      >
        <CancelIcon sx={{ fontSize: 64, color: '#f44336' }} />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: '#333',
          textAlign: 'center',
        }}
      >
        Pago cancelado
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: '#666',
          textAlign: 'center',
          maxWidth: 400,
        }}
      >
        No se ha completado tu pago. Puedes volver y elegir otra forma de pago para continuar con tu suscripción.
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate('/app/plan')}
        sx={{
          mt: 2,
          px: 4,
          py: 1.5,
          borderRadius: 12,
          backgroundColor: '#6F4E37',
          color: '#fff',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: '#5c3f2d',
          },
        }}
      >
        Volver a planes
      </Button>
    </Stack>
  );
};
