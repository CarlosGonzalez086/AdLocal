import {
  TextField,
  Button,
  Card,
  Typography,
  Box,
  Stack,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangePasswordUser } from "../../../hooks/useChangePasswordUser";

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

export const UserChangePasswordForm = () => {
  const navigate = useNavigate();
  const { cambiarPassword, loading } = useChangePasswordUser();

  const [form, setForm] = useState({ passwordActual: "", passwordNueva: "" });
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        px: { xs: 1.5, sm: 2 },
        mt: { xs: 2, sm: 4 },
      }}
    >
      {/* Botón volver */}
      <Box sx={{ width: "100%", maxWidth: 480, mb: 2 }}>
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.875rem",
            color: "#007AFF",
            px: 2,
            py: 0.8,
            border: "1px solid rgba(0,122,255,0.20)",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(0,122,255,0.06)",
              borderColor: "rgba(0,122,255,0.35)",
              transform: "translateX(-2px)",
            },
          }}
        >
          Volver al perfil
        </Button>
      </Box>

      {/* Card */}
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 480,
          borderRadius: 5,
          bgcolor: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
          p: { xs: 2.5, sm: 3.5 },
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={1.5} mb={3}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 3,
              background: "linear-gradient(135deg, #FF9500, #CC7700)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(255,149,0,0.30)",
            }}
          >
            <ShieldRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
          </Box>
          <Box>
            <Typography fontWeight={800} fontSize="1.05rem" letterSpacing="-0.2px">
              Cambiar contraseña
            </Typography>
            <Typography fontSize="0.72rem" color="text.disabled" mt={0.1}>
              Elige una contraseña segura
            </Typography>
          </Box>
        </Stack>

        <Stack spacing={2}>
          {/* Contraseña actual */}
          <TextField
            label="Contraseña actual"
            type={showActual ? "text" : "password"}
            fullWidth
            value={form.passwordActual}
            onChange={(e) => setForm({ ...form, passwordActual: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowActual(!showActual)} edge="end">
                    {showActual
                      ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                      : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                    }
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={fieldSx}
          />

          {/* Nueva contraseña */}
          <TextField
            label="Nueva contraseña"
            type={showNueva ? "text" : "password"}
            fullWidth
            helperText="Mínimo 8 caracteres"
            value={form.passwordNueva}
            onChange={(e) => setForm({ ...form, passwordNueva: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockRoundedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowNueva(!showNueva)} edge="end">
                    {showNueva
                      ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18 }} />
                      : <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                    }
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={fieldSx}
          />

          {/* Botón */}
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              disabled={loading || !form.passwordActual || !form.passwordNueva}
              onClick={() => cambiarPassword(form)}
              startIcon={
                loading
                  ? <CircularProgress size={16} thickness={4} sx={{ color: "#fff" }} />
                  : <ShieldRoundedIcon sx={{ fontSize: 17 }} />
              }
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                px: 3,
                py: 1.1,
                background: loading
                  ? undefined
                  : "linear-gradient(135deg, #FF9500, #CC7700)",
                boxShadow: loading ? "none" : "0 6px 18px rgba(255,149,0,0.30)",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 10px 24px rgba(255,149,0,0.42)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              {loading ? "Cambiando…" : "Cambiar contraseña"}
            </Button>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
};