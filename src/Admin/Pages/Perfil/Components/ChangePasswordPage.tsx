import { TextField, Button, IconButton, Box, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangePassword } from "../../../../hooks/useChangePassword";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { cambiarPassword, loading } = useChangePassword();

  const [form, setForm] = useState({
    passwordActual: "",
    passwordNueva: "",
  });

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <IconButton onClick={() => navigate(-1)} aria-label="Volver">
          <MaterialSymbol icon="arrow_back" size="medium" />
        </IconButton>
        <Typography className="ms-2 fz-h4 fw-medium">
          Volver al perfil
        </Typography>
      </div>

      <div className="d-flex justify-content-center">
        <div className="card-adlocal change-password-card">
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <MaterialSymbol
              icon="lock"
              size="medium"
              filled
              className="change-password-icon"
            />
            <Typography className="fz-h2 fw-semibold">
              Cambiar contraseña
            </Typography>
          </Box>

          <div className="row">
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

            <div className="col-12 d-flex justify-content-end">
              <Button
                disabled={loading}
                onClick={() => cambiarPassword(form)}
                className="btn-adlocal btn-adlocal--warning fz-h4 fw-semibold"
              >
                Cambiar contraseña
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
