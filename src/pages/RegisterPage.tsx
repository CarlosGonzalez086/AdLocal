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
        type === "admin"
          ? await adminApi.crearAdmin(data)
          : await authApi.registroUsuario(data);

      isCreated = true;

      if (type !== "admin") {
        try {
          await sendWelcomeEmail(
            res.data.respuesta.nombre,
            res.data.respuesta.email,
          );
        } catch {
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

        {/* Card Registro */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          <Typography fontSize={22} fontWeight={800} textAlign="center" mb={1}>
            {type === "admin" ? "Crear administrador" : "Crear cuenta"}
          </Typography>

          <Typography
            fontSize={14}
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            {type === "admin"
              ? "Registro de administrador del sistema"
              : "Crea tu cuenta en minutos"}
          </Typography>

          <AdminForm
            onSubmit={handleCreate}
            type={type}
            isFormCode={type == "user"}
          />

          <Divider sx={{ my: 3 }} />

          {/* Acciones */}
          <Box display="flex" flexDirection="column" gap={1.5}>
            <Button
              fullWidth
              size="large"
              onClick={() =>
                navigate(type === "admin" ? "/login/admin" : "/login")
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
              ¿Ya tienes cuenta? Inicia sesión
            </Button>

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
