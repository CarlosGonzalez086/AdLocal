import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Container,
  TextField,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useForgetPassword } from "../hooks/useForgetPassword";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const { forgetPassword, loading, error, successMessage } =
    useForgetPassword();

  const handleSubmit = async () => {
    if (!email) return;
    await forgetPassword(email);
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
            sx={{ width: { xs: 180, sm: 220 } }}
          />
        </Box>

        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" align="center" mb={2}>
            Recuperar contraseña
          </Typography>

          <Typography align="center" color="text.secondary" mb={3}>
            Ingresa tu correo y te enviaremos un enlace para cambiar tu
            contraseña
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <TextField
            label="Correo electrónico"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Divider sx={{ my: 3 }} />

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              bgcolor: "#6F4E37",
              "&:hover": { bgcolor: "#e8692c" },
            }}
          >
            {loading ? "Enviando..." : "Enviar correo"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
