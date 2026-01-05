import {
  Paper,
  Typography,
  Box,
  Divider,
  Button,
  Container,
} from "@mui/material";
import AdminForm from "../components/forms/AdminForm";
import { adminApi } from "../api/admin.api";

import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { authApi, sendWelcomeEmail } from "../api/authApi";

interface Props {
  type: "admin" | "user";
}

export default function RegisterPage({ type }: Props) {
  const navigate = useNavigate();

  const handleCreate = async (data: any) => {
    let isCreated = false;

    try {
      const res =
        type == "admin"
          ? await adminApi.crearAdmin(data)
          : await authApi.registroUsuario(data);

      isCreated = true;
      if (type != "admin") {
        try {
          await sendWelcomeEmail(
            res.data.respuesta.nombre,
            res.data.respuesta.email
          );
        } catch (emailError) {
          console.error("Error al enviar correo de bienvenida:", emailError);

          Swal.fire({
            icon: "warning",
            title: "Cuenta creada",
            text: "La cuenta se creó correctamente, pero no fue posible enviar el correo de bienvenida.",
          });
        }
      }

      Swal.fire({
        icon: "success",
        title: type === "admin" ? "Administrador creado" : "Cuenta creada",
        text: res.data.mensaje,
      });

      navigate(type === "admin" ? "/login/admin" : "/login");
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.mensaje ||
          "Error al crear la cuenta. Inténtalo nuevamente.",
      });
    } finally {
      if (!isCreated) {
        console.warn("El proceso de creación no se completó.");
      }
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
          <Typography variant="h5" fontWeight="bold" textAlign="center" mb={1}>
            {type === "admin" ? "Crear administrador" : "Crear cuenta"}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            {type === "admin"
              ? "Registro de administrador del sistema"
              : "Registro de usuario"}
          </Typography>

          <AdminForm onSubmit={handleCreate} type={type} />

          <Divider sx={{ my: 3 }} />

          <Button
            variant="outlined"
            fullWidth
            size="large"
            onClick={() =>
              navigate(type === "admin" ? "/login/admin" : "/login")
            }
          >
            Iniciar sesión
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
