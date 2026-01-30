import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Container,
} from "@mui/material";
import LoginForm from "../components/forms/LoginForm";
import { adminApi } from "../api/admin.api";
import Swal from "sweetalert2";
import { authApi } from "../api/authApi";
import { useNavigate } from "react-router-dom";

interface Props {
  type: "admin" | "user";
}

export default function LoginPage({ type }: Props) {
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    try {
      const res =
        type === "admin"
          ? await adminApi.loginAdmin(data)
          : await authApi.login(data);

      localStorage.setItem("token", res.data.respuesta.token);

      await Swal.fire({
        icon: "success",
        title: "Bienvenido",
        timer: 1200,
        showConfirmButton: false,
      });

      window.location.href = type === "admin" ? "/Admin" : "/app";
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.mensaje ||
          "Correo o contraseña incorrectos",
      });
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "#F2F2F7",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
      padding={3}
    >
      <Container maxWidth="sm">
        {/* Logo */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 4,
          }}
        >
          <Box
            component="img"
            src="https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg"
            alt="AdLocal"
            sx={{
              width: { xs: 160, sm: 200 },
              borderRadius: 3,
            }}
          />
        </Box>

        {/* Card Login */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(14px)",
            boxShadow:
              "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            fontSize={22}
            fontWeight={800}
            align="center"
            mb={1}
          >
            {type === "admin"
              ? "Acceso administrador"
              : "Inicia sesión"}
          </Typography>

          <Typography
            fontSize={14}
            color="text.secondary"
            align="center"
            mb={3}
          >
            Accede a tu cuenta para continuar
          </Typography>

          <LoginForm onSubmit={handleLogin} />

          <Divider sx={{ my: 3 }} />

          {/* Acciones */}
          <Box display="flex" flexDirection="column" gap={1.5}>
            <Button
              fullWidth
              size="large"
              onClick={() =>
                type === "admin"
                  ? navigate("/crear-admin")
                  : navigate("/registro")
              }
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                borderColor: "#007AFF",
                color: "#007AFF",
                "&:hover": {
                  bgcolor: "rgba(0,122,255,0.08)",
                },
              }}
              variant="outlined"
            >
              {type === "admin"
                ? "Crear administrador"
                : "Crear cuenta"}
            </Button>

            <Button
              fullWidth
              size="large"
              onClick={() =>
                navigate("/recuperar-contrasena")
              }
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
              }}
              variant="text"
            >
              ¿Olvidaste tu contraseña?
            </Button>

            <Divider sx={{ my: 1 }} />

            <Button
              fullWidth
              size="large"
              onClick={() => navigate("/planes")}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
              }}
              variant="text"
            >
              Ver planes disponibles
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
