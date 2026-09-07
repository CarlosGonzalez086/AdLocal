import { TextField, Button, IconButton } from "@mui/material";
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
        <span className="ms-2 fz-h4 fw-medium text-dark">
          Volver al perfil
        </span>
      </div>

      <div className="d-flex justify-content-center">
        <div className="card-adlocal change-password-card">
          <div className="d-flex align-items-center gap-2 mb-3">
            <MaterialSymbol
              icon="lock"
              size="medium"
              filled
              className="change-password-icon"
            />
            <h2 className="fz-h4 fw-semibold mb-0 text-dark">
              Cambiar contraseña
            </h2>
          </div>

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
                className="form-control-mui-adlocal"
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
                className="form-control-mui-adlocal"
              />
            </div>

            <div className="col-12 d-flex justify-content-end">
              <Button
                disabled={loading}
                onClick={() => cambiarPassword(form)}
                className="btn-adlocal btn-adlocal-primary fz-h4 fw-semibold"
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
