import { Button, Stack, Typography, Box } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { UserContext } from "../../../context/UserContext ";
import { useActualizarJwt } from "../../../hooks/useActualizarJwt";

export const CheckoutSuccessPage = () => {
  const navigate = useNavigate();
  const user = useContext(UserContext);
  const { actualizarJwt } = useActualizarJwt();

  useEffect(() => {
    if (!user?.sub) return;
    const timer = setTimeout(() => {
      actualizarJwt({ email: user.sub, updateJWT: true });
    }, 1500);
    return () => clearTimeout(timer);
  }, [user?.sub]);

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
            background: "linear-gradient(135deg, #34C759, #30D158)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 12px 32px rgba(52,199,89,0.32)",
            mb: 1,
          }}
        >
          <CheckCircleRoundedIcon sx={{ fontSize: 52, color: "#fff" }} />
        </Box>

        {/* Confeti emoji decorativo */}
        <Typography fontSize="2rem" lineHeight={1}>
          🎉
        </Typography>

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
            ¡Pago exitoso!
          </Typography>

          <Typography
            sx={{
              fontSize: "0.9rem",
              color: "text.secondary",
              lineHeight: 1.6,
              maxWidth: 300,
            }}
          >
            Tu suscripción ha sido activada correctamente. ¡Disfruta de todos los beneficios!
          </Typography>
        </Stack>

        {/* Divider decorativo */}
        <Box
          sx={{
            width: 48,
            height: 4,
            borderRadius: 999,
            background: "linear-gradient(135deg, #34C759, #30D158)",
            opacity: 0.5,
          }}
        />

        {/* Botón */}
        <Button
          fullWidth
          variant="contained"
          onClick={() => navigate("/app/plan")}
          endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            mt: 1,
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
          Ver mi plan
        </Button>
      </Box>
    </Box>
  );
};