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
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForgetPassword } from "../hooks/useForgetPassword";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

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

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const { checkToken, newPassword, loading, error, successMessage } =
    useForgetPassword();

  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    await newPassword({ codigo, passwordNueva: password });
    if (!error) {
      setTimeout(() => navigate("/login"), 2000);
    }
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
            Cambiar contraseña
          </Typography>

          <Typography fontSize={14} color="text.secondary" mb={3}>
            Ingresa el código recibido y tu nueva contraseña
          </Typography>

          {/* Estados de validación del token */}
          {loading && tokenValido === null && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: 3 }}>
              Validando enlace...
            </Alert>
          )}

          {tokenValido === false && (
            <Alert severity="error" sx={{ borderRadius: 3 }}>
              El enlace de recuperación no es válido o ya expiró.
            </Alert>
          )}

          {tokenValido && (
            <>
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

              <Box display="flex" flexDirection="column" gap={2}>
                <TextField
                  placeholder="Código de verificación"
                  fullWidth
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <KeyOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  placeholder="Nueva contraseña"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword((prev) => !prev)}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
                          ) : (
                            <VisibilityOutlinedIcon sx={{ color: "#9E9E9E", fontSize: 20 }} />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

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
                {loading ? "Guardando..." : "Cambiar contraseña"}
              </Button>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
}