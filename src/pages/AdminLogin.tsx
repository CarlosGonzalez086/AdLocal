import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import { adminApi } from "../api/admin.api";
import LoginForm from "../components/forms/LoginForm";
import Swal from "sweetalert2";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    try {
      const res = await adminApi.loginAdmin(data);

      await Swal.fire({
        icon: "success",
        title: "Inicio de sesión exitoso",
        text: "Bienvenido nuevamente",
        timer: 1500,
        showConfirmButton: false,
      });

      localStorage.setItem("token", res.data.respuesta.token);

      window.location.href = "/";
    } catch (error: any) {
      console.error("Error al iniciar sesión", error);

      const mensaje =
        error?.response?.data?.mensaje || "Usuario o contraseña incorrectos";

      // Error
      Swal.fire({
        icon: "error",
        title: "Error al iniciar sesión",
        text: mensaje,
        confirmButtonColor: "#d33",
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
          Iniciar sesión
        </Typography>

        <LoginForm onSubmit={handleLogin} />

        <Divider sx={{ my: 3 }} />

        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/crear-admin")}
        >
          Crear administrador
        </Button>
      </Paper>
    </Box>
  );
}
