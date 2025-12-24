import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, Divider } from "@mui/material";
import { adminApi } from "../api/admin.api";
import LoginForm from "../components/forms/LoginForm";

export default function AdminLogin() {
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    try {
      const res = await adminApi.loginAdmin(data);

      localStorage.setItem("token", res.data.respuesta.token);

      window.location.href = "/";
    } catch (error) {
      console.error("Error al iniciar sesión", error);
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

        {/* 🔽 Separador */}
        <Divider sx={{ my: 3 }} />

        {/* 🔽 Botón crear admin */}
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
