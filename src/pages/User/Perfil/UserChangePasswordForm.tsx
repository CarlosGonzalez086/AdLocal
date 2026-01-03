import {
  TextField,
  Button,
  Card,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangePasswordUser } from "../../../hooks/useChangePasswordUser";

export const UserChangePasswordForm = () => {
  const navigate = useNavigate();
  const { cambiarPassword, loading } = useChangePasswordUser();

  const [form, setForm] = useState({
    passwordActual: "",
    passwordNueva: "",
  });

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <IconButton onClick={() => navigate(-1)} aria-label="Volver">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body1" className="ms-2">
          Volver al perfil
        </Typography>
      </div>

      <div className="d-flex justify-content-center">
        <Card sx={{ maxWidth: 420, width: "100%", p: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <LockIcon color="warning" />
            <Typography variant="h6">Cambiar contraseña</Typography>
          </Box>

          <TextField
            label="Contraseña actual"
            type="password"
            fullWidth
            size="small"
            value={form.passwordActual}
            onChange={(e) =>
              setForm({ ...form, passwordActual: e.target.value })
            }
            className="mb-3"
          />

          <TextField
            label="Nueva contraseña"
            type="password"
            fullWidth
            size="small"
            helperText="Mínimo 8 caracteres"
            value={form.passwordNueva}
            onChange={(e) =>
              setForm({ ...form, passwordNueva: e.target.value })
            }
            className="mb-3"
          />

          <div className="d-flex justify-content-end">
            <Button
              variant="contained"
              color="warning"
              disabled={loading}
              onClick={() => cambiarPassword(form)}
            >
              Cambiar contraseña
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
