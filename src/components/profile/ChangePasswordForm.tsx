import { TextField, Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
    <div className="row mt-4">
      {/* Header */}
      <div className="col-12 d-flex align-items-center mb-3">
        <IconButton onClick={() => navigate(-1)} aria-label="Volver">
          <ArrowBackIcon />
        </IconButton>
        <h6 className="mb-0 ms-2">Ir a Perfil</h6>
      </div>

      {/* Password actual */}
      <div className="col-12 col-md-6 mb-3">
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
      <div className="col-12 col-md-6 mb-3">
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
  );
};
