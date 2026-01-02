import { Paper, Typography, Box, Divider, Button } from "@mui/material";
import AdminForm from "../components/forms/AdminForm";
import { adminApi } from "../api/admin.api";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authApi } from "../api/authApi";

interface Props {
  type: "admin" | "user";
}

export default function RegisterPage({ type }: Props) {
  const navigate = useNavigate();

  const handleCreate = async (data: any) => {
    try {
      const res =
        type === "admin"
          ? await adminApi.crearAdmin(data)
          : await authApi.registroUsuario(data);

      Swal.fire({
        icon: "success",
        title:
          type === "admin"
            ? "Administrador creado"
            : "Cuenta creada",
        text: res.data.mensaje,
      });

      navigate(type === "admin" ? "/login/admin" : "/login");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.mensaje ||
          "Error al crear la cuenta",
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
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, width: "100%" }}>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          {type === "admin" ? "Crear administrador" : "Crear cuenta"}
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          {type === "admin"
            ? "Registro de administrador del sistema"
            : "Registro de usuario"}
        </Typography>

        <AdminForm onSubmit={handleCreate} type={type} />

        <Divider sx={{ my: 3 }} />

        <Button
          variant="outlined"
          fullWidth
          onClick={() =>
            navigate(type === "admin" ? "/login/admin" : "/login")
          }
        >
          Iniciar sesión
        </Button>
      </Paper>
    </Box>
  );
}
