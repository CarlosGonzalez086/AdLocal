// CheckoutSuccessPage.tsx
import { Button, Stack, Typography, Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
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
      actualizarJwt({
        email: user.sub,
        updateJWT: true,
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [user?.sub]);

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      spacing={3}
      sx={{
        minHeight: "80vh",
        px: 2,
        backgroundColor: "#f7f8fa",
      }}
    >
      <Box
        sx={{
          width: 140,
          height: 140,
          borderRadius: "50%",
          backgroundColor: "#e6f7ef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: "#4caf50" }} />
      </Box>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#333",
          textAlign: "center",
        }}
      >
        ✅ Pago exitoso
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#666",
          textAlign: "center",
          maxWidth: 400,
        }}
      >
        Tu suscripción ha sido activada correctamente. ¡Disfruta de todos los
        beneficios!
      </Typography>

      <Button
        variant="contained"
        onClick={() => navigate("/app/plan")}
        sx={{
          mt: 2,
          px: 4,
          py: 1.5,
          borderRadius: 3,
          backgroundColor: "#6F4E37",
          color: "#fff",
          fontWeight: 600,
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#5c3f2d",
          },
        }}
      >
        Ver mi plan
      </Button>
    </Stack>
  );
};
