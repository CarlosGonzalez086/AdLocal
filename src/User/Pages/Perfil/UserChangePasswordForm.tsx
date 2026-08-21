import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChangePasswordUser } from "../../../hooks/useChangePasswordUser";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

export const UserChangePasswordForm = () => {
  const navigate = useNavigate();

  const { cambiarPassword, loading } = useChangePasswordUser();

  const [form, setForm] = useState({
    passwordActual: "",
    passwordNueva: "",
  });

  const [showActual, setShowActual] = useState(false);

  const [showNueva, setShowNueva] = useState(false);

  const canSubmit =
    Boolean(form.passwordActual) && Boolean(form.passwordNueva) && !loading;

  const handleActualChange = (value: string) => {
    setForm((previousForm) => ({
      ...previousForm,
      passwordActual: value,
    }));
  };

  const handleNuevaChange = (value: string) => {
    setForm((previousForm) => ({
      ...previousForm,
      passwordNueva: value,
    }));
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    cambiarPassword(form);
  };

  return (
    <div className="changePasswordPage">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="mb-3">
              <Button
                type="button"
                variant="outlined"
                className="btn-adlocal btn-adlocal--ghost fz-h4 fw-semibold"
                onClick={() => navigate(-1)}
                startIcon={<MaterialSymbol icon="arrow_back" size="small" />}
              >
                Volver al perfil
              </Button>
            </div>

            <div
              className="changePasswordCard"
              aria-labelledby="change-password-title"
            >
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="changePasswordHeaderIcon flex-shrink-0">
                  <MaterialSymbol icon="shield" size="small" filled />
                </div>

                <div>
                  <h1
                    id="change-password-title"
                    className="changePasswordTitle fz-h2 fw-bold mb-1"
                  >
                    Cambiar contraseña
                  </h1>

                  <p className="changePasswordDescription fz-h5 fw-regular mb-0">
                    Elige una contraseña segura
                  </p>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-12">
                  <TextField
                    label="Contraseña actual"
                    type={showActual ? "text" : "password"}
                    fullWidth
                    value={form.passwordActual}
                    onChange={(event) => handleActualChange(event.target.value)}
                    className="adlocalTextField"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MaterialSymbol icon="lock" size="small" />
                          </InputAdornment>
                        ),

                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              size="small"
                              edge="end"
                              className="changePasswordVisibilityButton"
                              onClick={() =>
                                setShowActual((current) => !current)
                              }
                              aria-label={
                                showActual
                                  ? "Ocultar contraseña actual"
                                  : "Mostrar contraseña actual"
                              }
                            >
                              {showActual ? (
                                <MaterialSymbol
                                  icon="visibility_off"
                                  size="small"
                                />
                              ) : (
                                <MaterialSymbol
                                  icon="visibility"
                                  size="small"
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>

                <div className="col-12">
                  <TextField
                    label="Nueva contraseña"
                    type={showNueva ? "text" : "password"}
                    fullWidth
                    helperText="Mínimo 8 caracteres"
                    value={form.passwordNueva}
                    onChange={(event) => handleNuevaChange(event.target.value)}
                    className="adlocalTextField"
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <MaterialSymbol icon="lock" size="small" />
                          </InputAdornment>
                        ),

                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              type="button"
                              size="small"
                              edge="end"
                              className="changePasswordVisibilityButton"
                              onClick={() =>
                                setShowNueva((current) => !current)
                              }
                              aria-label={
                                showNueva
                                  ? "Ocultar nueva contraseña"
                                  : "Mostrar nueva contraseña"
                              }
                            >
                              {showNueva ? (
                                <MaterialSymbol
                                  icon="visibility_off"
                                  size="small"
                                />
                              ) : (
                                <MaterialSymbol
                                  icon="visibility"
                                  size="small"
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <Button
                  type="button"
                  variant="contained"
                  disabled={!canSubmit}
                  className="btn-adlocal btn-adlocal--solid fz-h4 fw-bold"
                  onClick={handleSubmit}
                  startIcon={
                    loading ? (
                      <CircularProgress
                        size={16}
                        thickness={4}
                        className="changePasswordButtonProgress"
                      />
                    ) : (
                      <MaterialSymbol icon="shield" size="small" filled />
                    )
                  }
                >
                  {loading ? "Cambiando…" : "Cambiar contraseña"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
