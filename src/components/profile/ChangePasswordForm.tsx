import {
  TextField,
  Button,
  IconButton,
  Card,
  Typography,
  Box,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangePassword } from "../../pages/profile/useChangePassword";

export const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { cambiarPassword, loading } = useChangePassword();

  const [form, setForm] = useState({
    passwordActual: "",
    passwordNueva: "",
  });

  return (
    <div>
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <IconButton onClick={() => navigate(-1)} aria-label="Volver">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="body1" fontWeight={500} className="ms-2">
          Volver al perfil
        </Typography>
      </div>

      {/* Card centrada */}
      <div className="d-flex justify-content-center">
        <Card
          sx={{
            maxWidth: 420,
            width: "100%",
            p: 3,
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
            borderRadius: 2,
          }}
        >
          {/* Título */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            mb={2}
          >
            <LockIcon color="warning" />
            <Typography variant="h6">
              Cambiar contraseña
            </Typography>
          </Box>

          <div className="row">
            {/* Password actual */}
            <div className="col-12 mb-3">
              <TextField
                label="Contraseña actual"
                type="password"
                fullWidth
                size="small"
                value={form.passwordActual}
                onChange={(e) =>
                  setForm({ ...form, passwordActual: e.target.value })
                }
              />
            </div>

            {/* Nueva password */}
            <div className="col-12 mb-3">
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
              />
            </div>

            {/* Acción */}
            <div className="col-12 d-flex justify-content-end">
              <Button
                variant="contained"
                color="warning"
                disabled={loading}
                onClick={() => cambiarPassword(form)}
              >
                Cambiar contraseña
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
