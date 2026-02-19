import {
  Box,
  Paper,
  Typography,
  Divider,
  Button,
  Container,
  TextField,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useForgetPassword } from "../hooks/useForgetPassword";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { useNavigate } from "react-router-dom";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#BDBDBD" },
    "&.Mui-focused fieldset": { borderColor: "#007AFF" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#007AFF" },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const { forgetPassword, loading, error, successMessage } = useForgetPassword();

  const handleSubmit = async () => {
    if (!email) return;
    await forgetPassword(email);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F2F2F7",
        overflow: "auto",
        alignItems: "center",
        justifyContent: "center",
      }}
      padding={3}
    >
      {/* Botón regresar */}
      <Box sx={{ position: "absolute", top: 24, left: 24 }}>
        <Button
          onClick={() => navigate("/login")}
          sx={{
            borderRadius: 999,
            px: 2.5,
            fontWeight: 600,
            textTransform: "none",
            borderColor: "#007AFF",
            color: "#007AFF",
            "&:hover": { bgcolor: "rgba(0,122,255,0.08)" },
          }}
          variant="outlined"
          startIcon={<ArrowBackIosNewIcon sx={{ fontSize: 14 }} />}
        >
          Regresar
        </Button>
      </Box>

      <Container maxWidth="xs">
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box
            component="img"
            src="https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg"
            alt="AdLocal"
            sx={{ width: { xs: 140, sm: 180 }, borderRadius: 3 }}
          />
        </Box>

        {/* Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.9)",
            backdropFilter: "blur(14px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          }}
        >
          <Typography fontSize={24} fontWeight={800} mb={0.5}>
            Recuperar contraseña
          </Typography>

          <Typography fontSize={14} color="text.secondary" mb={3}>
            Ingresa tu correo y te enviaremos un enlace para cambiar tu contraseña
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
              {successMessage}
            </Alert>
          )}

          <TextField
            placeholder="Correo electrónico"
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={fieldSx}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />

          <Divider sx={{ my: 3, fontSize: 13, color: "text.disabled" }}>
            o
          </Divider>

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            onClick={handleSubmit}
            sx={{
              borderRadius: "999px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: 16,
              bgcolor: "#1A1A1A",
              py: 1.5,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#333",
                boxShadow: "none",
              },
            }}
          >
            {loading ? "Enviando..." : "Enviar correo"}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}