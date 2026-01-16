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
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForgetPassword } from "../hooks/useForgetPassword";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { checkToken, newPassword, loading, error, successMessage } =
    useForgetPassword();

  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);

  useEffect(() => {
    const validarToken = async () => {
      if (!token) {
        setTokenValido(false);
        return;
      }

      const esValido = await checkToken(token);
      setTokenValido(esValido);
    };

    validarToken();
  }, [token]);

  const handleSubmit = async () => {
    if (!codigo || !password) return;

    await newPassword({
      codigo,
      passwordNueva: password,
    });

    if (!error) {
      setTimeout(() => navigate("/login"), 2000);
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
            sx={{ width: { xs: 180, sm: 220 } }}
          />
        </Box>

        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" fontWeight="bold" align="center" mb={2}>
            Cambiar contraseña
          </Typography>

          {loading && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Validando enlace...
            </Alert>
          )}

          {tokenValido === false && (
            <Alert severity="error">
              El enlace de recuperación no es válido o ya expiró.
            </Alert>
          )}

          {tokenValido && (
            <>
              <Typography align="center" color="text.secondary" mb={3}>
                Ingresa el código recibido y tu nueva contraseña
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
                label="Código de verificación"
                fullWidth
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                sx={{ mb: 2 }}
              />

              <TextField
                label="Nueva contraseña"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                {loading ? "Guardando..." : "Cambiar contraseña"}
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
