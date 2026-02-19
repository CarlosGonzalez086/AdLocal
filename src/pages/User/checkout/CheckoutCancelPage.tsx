import { Button, Stack, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

export const CheckoutCancelPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#F2F2F7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 5,
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          boxShadow: "0 20px 48px rgba(0,0,0,0.10)",
          border: "1px solid rgba(0,0,0,0.06)",
          px: { xs: 3, sm: 5 },
          py: { xs: 5, sm: 6 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* Ícono */}
        <Box
          sx={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FF453A, #FF3B30)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 32px rgba(255,59,48,0.30)",
            mb: 1,
          }}
        >
          <CancelRoundedIcon sx={{ fontSize: 52, color: "#fff" }} />
        </Box>

        {/* Texto */}
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.5rem", sm: "1.7rem" },
              color: "#1c1c1e",
              letterSpacing: "-0.5px",
            }}
          >
            Pago cancelado
          </Typography>

          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "text.secondary",
              lineHeight: 1.6,
              maxWidth: 320,
            }}
          >
            No se completó tu pago. Puedes volver y elegir otra forma de pago para continuar con tu suscripción.
          </Typography>
        </Stack>

        {/* Botón */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/app/plan")}
          startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 999,
            fontWeight: 700,
            fontSize: "0.95rem",
            textTransform: "none",
            background: "linear-gradient(135deg, #6F4E37, #3A2419)",
            boxShadow: "0 8px 22px rgba(111,78,55,0.30)",
            transition: "all 0.25s ease",
            "&:hover": {
              boxShadow: "0 12px 28px rgba(111,78,55,0.42)",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          Volver a planes
        </Button>
      </Box>
    </Box>
  );
};