import { Paper, Typography, Box, Divider, Button } from "@mui/material";
import AdminForm from "../components/forms/AdminForm";
import { adminApi } from "../api/admin.api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AdminCreate() {
  const navigate = useNavigate();
  const handleCreate = async (data: any) => {
    try {
      const res = await adminApi.crearAdmin(data);

      // ✅ Éxito
      Swal.fire({
        icon: "success",
        title: "Administrador creado",
        text: res.data.mensaje || "El administrador fue creado correctamente",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#111827",
      });

      navigate("/login"); // regresar al login
    } catch (error: any) {
      // ❌ Error desde backend
      const message =
        error?.response?.data?.mensaje ||
        "Ocurrió un error al crear el administrador";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#991B1B",
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
          Crear administrador
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Registra un nuevo administrador del sistema
        </Typography>

        <AdminForm onSubmit={handleCreate} />

        <Divider sx={{ my: 3 }} />

        {/* 🔽 Botón Iniciar sesión */}
        <Button variant="outlined" fullWidth onClick={() => navigate("/login")}>
          Iniciar sesión
        </Button>
      </Paper>
    </Box>
  );
}
