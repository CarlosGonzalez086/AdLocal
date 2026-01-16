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
        type == "admin"
          ? await adminApi.loginAdmin(data)
          : await authApi.login(data);

      localStorage.setItem("token", res.data.respuesta.token);

      await Swal.fire({
        icon: "success",
        title: "Bienvenido",
        timer: 1200,
        showConfirmButton: false,
      });

      window.location.href = type == "admin" ? "/Admin" : "/app";
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
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
            mt: 3,
          }}
        >
          <Box
            component="img"
            src="https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg"
            alt="AdLocal"
            sx={{
              width: { xs: 180, sm: 220 },
              maxWidth: "100%",
            }}
          />
        </Box>

        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" align="center" mb={2}>
            {type === "admin" ? "Login Administrador" : "Iniciar sesión"}
          </Typography>

          <LoginForm onSubmit={handleLogin} />

          <Divider sx={{ my: 3 }} />

          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() =>
              type === "admin"
                ? navigate("/crear-admin")
                : navigate("/registro")
            }
          >
            {type === "admin" ? "Crear administrador" : "Crear usuario"}
          </Button>
          <Divider sx={{ my: 3 }} />

          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() => navigate("/recuperar-contrasena")}
          >
            Restablecer contraseña
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
