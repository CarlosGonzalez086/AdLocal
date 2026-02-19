import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Container,
  Link,
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
          error?.response?.data?.mensaje || "Correo o contraseña incorrectos",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F2F2F7",
        overflow: "auto",
        alignItems: "center",
        justifyContent: "center",
      }}
      padding={3}
    >
      <Container maxWidth="xs">
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box
            component="img"
            src="https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg"
            alt="AdLocal"
            sx={{ width: { xs: 140, sm: 180 }, borderRadius: 3 }}
          />
        </Box>

        {/* Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <Typography fontSize={24} fontWeight={800} mb={0.5}>
            {type === "admin" ? "Acceso administrador" : "Iniciar sesión"}
          </Typography>

          <Typography fontSize={14} color="text.secondary" mb={3}>
            {type === "admin" ? (
              "Accede a tu cuenta para continuar"
            ) : (
              <>
                Nuevo Usuario?{" "}
                <Link
                  component="button"
                  onClick={() => navigate("/registro")}
                  sx={{
                    color: "#007AFF",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  Crear cuenta
                </Link>
              </>
            )}
          </Typography>

          {/* Form */}
          <LoginForm onSubmit={handleLogin} />

          {/* Forgot password */}
          <Box mt={1.5}>
            <Link
              component="button"
              onClick={() => navigate("/recuperar-contrasena")}
              sx={{
                fontSize: 14,
                color: "#007AFF",
                fontWeight: 500,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>

          <Divider sx={{ my: 3, fontSize: 13, color: "text.disabled" }}>
            o
          </Divider>

          {/* Planes / Crear admin */}
          <Button
            fullWidth
            size="large"
            onClick={() =>
              type === "admin" ? navigate("/crear-admin") : navigate("/planes")
            }
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "#007AFF",
              color: "#007AFF",
              "&:hover": { bgcolor: "rgba(0,122,255,0.08)" },
            }}
            variant="outlined"
          >
            {type === "admin"
              ? "Crear administrador"
              : "Ver planes disponibles"}
          </Button>

          {/* Terms */}
          {type === "user" && (
            <Typography
              fontSize={12}
              color="text.disabled"
              align="center"
              mt={3}
            >
              Al registrarte, aceptas nuestros{" "}
              <Link href="#" sx={{ color: "#007AFF", textDecoration: "none" }}>
                Términos y Condiciones
              </Link>{" "}
              and{" "}
              <Link href="#" sx={{ color: "#007AFF", textDecoration: "none" }}>
                Política de Privacidad
              </Link>
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
