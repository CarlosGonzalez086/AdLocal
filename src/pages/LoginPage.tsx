import { Box, Paper, Typography, Divider, Button } from "@mui/material";
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
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f5f5"
    >
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" fontWeight="bold" align="center" mb={2}>
          {type == "admin" ? "Login Administrador" : "Iniciar sesión"}
        </Typography>

        <LoginForm onSubmit={handleLogin} />

        <Divider sx={{ my: 3 }} />
        <Button
          variant="outlined"
          fullWidth
          onClick={() =>
            type == "admin" ? navigate("/crear-admin") : navigate("/registro")
          }
        >
          {type == "admin" ? "Crear administrador" : "Crear usuario"}
        </Button>
      </Paper>
    </Box>
  );
}
