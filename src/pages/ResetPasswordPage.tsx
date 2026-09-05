import {
  Alert,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";

const LOGO_URL = "/logo-adlocal.png";

export default function ResetPasswordPage() {
  const { token, type } = useParams<{
    token: string;
    type: "admin" | "user";
  }>();

  const navigate = useNavigate();
  const isAdmin = type === "admin";
  const admin = useAdmin();
  const user = useUser();
  const loading = isAdmin ? admin.loading : user.loading;

  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);
  const [validatingToken, setValidatingToken] = useState(true);
  const [codigoTouched, setCodigoTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const cleanCode = codigo.trim();
  const codigoIsInvalid = codigoTouched && cleanCode.length === 0;
  const passwordIsInvalid = passwordTouched && password.length === 0;
  const formIsInvalid = cleanCode.length === 0 || password.length === 0;
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    let componentMounted = true;

    const validarToken = async () => {
      if (!token) {
        if (componentMounted) {
          setTokenValido(false);
          setValidatingToken(false);
          setError("El enlace de recuperación no es válido.");
        }

        return;
      }

      try {
        setValidatingToken(true);

        const esValido = isAdmin
          ? await admin.checkToken(token)
          : await user.checkToken(token);

        if (componentMounted) {
          setTokenValido(Boolean(esValido));
        }
      } catch (validationError) {
        console.error("Error al validar el token:", validationError);

        if (componentMounted) {
          setTokenValido(false);
        }
      } finally {
        if (componentMounted) {
          setValidatingToken(false);
        }
      }
    };

    void validarToken();

    return () => {
      componentMounted = false;
    };
  }, [token]);

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const redirectTimeout = window.setTimeout(() => {
      navigate(isAdmin ? "/admin/login" : "/usuario/login", {
        replace: true,
      });
    }, 2000);

    return () => {
      window.clearTimeout(redirectTimeout);
    };
  }, [successMessage, navigate, isAdmin]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setCodigoTouched(true);
    setPasswordTouched(true);

    if (formIsInvalid || loading || !tokenValido) {
      return;
    }

    try {
      const response = isAdmin
        ? await admin.newPassword({
            codigo: cleanCode,
            passwordNueva: password,
          })
        : await user.newPassword({
            codigo: cleanCode,
            passwordNueva: password,
          });

      const data = response as any;

      if (data.codigo !== "200") {
        setError(data.mensaje || "Ocurrió un error inesperado.");
        setSuccessMessage("");
        return;
      }

      setSuccessMessage(data.mensaje);
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Ocurrió un error inesperado.");
      setSuccessMessage("");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-bg-decoration" aria-hidden="true">
        <div className="auth-decoration-1" />
        <div className="auth-decoration-2" />
      </div>

      <Button
        type="button"
        variant="outlined"
        className="auth-back-btn"
        onClick={() => navigate(isAdmin ? "/admin/login" : "/usuario/login")}
        startIcon={<MaterialSymbol icon="arrow_back_ios_new" size="small" />}
      >
        Regresar
      </Button>

      <div className="container auth-container" style={{ maxWidth: "440px" }}>
        <a
          href="/"
          className="auth-logo-link"
          aria-label="Ir al inicio de ADLocal"
        >
          <img
            src={LOGO_URL}
            alt="ADLocal"
            className="auth-logo-img"
          />
        </a>

        <form
          className="auth-card"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="auth-header">
            <div className="auth-header-icon">
              <MaterialSymbol icon="password" size="large" />
            </div>

            <div className="auth-header-content">
              <span className="auth-eyebrow">
                Seguridad de la cuenta
              </span>

              <h1 className="auth-title">
                Cambiar contraseña
              </h1>

              <p className="auth-description">
                Ingresa el código recibido en tu correo y establece una nueva
                contraseña para tu cuenta.
              </p>
            </div>
          </div>

          {validatingToken && (
            <Alert
              severity="info"
              variant="outlined"
              icon={
                <CircularProgress
                  size={18}
                  thickness={5}
                  className="text-primary"
                />
              }
              className="mt-3 rounded-3"
            >
              Validando el enlace de recuperación...
            </Alert>
          )}

          {!validatingToken && tokenValido === false && (
            <div className="auth-invalid-token-state">
              <div className="auth-invalid-token-icon">
                <MaterialSymbol icon="link_off" size="large" />
              </div>

              <h2 className="auth-invalid-token-title">
                Enlace no válido
              </h2>

              <p className="auth-invalid-token-desc">
                El enlace de recuperación no existe, ya expiró o fue utilizado
                anteriormente.
              </p>

              <Button
                type="button"
                variant="contained"
                fullWidth
                className="auth-submit-btn mt-3"
                onClick={() =>
                  navigate(
                    isAdmin
                      ? "/admin/recuperar-contrasena"
                      : "/usuario/recuperar-contrasena",
                  )
                }
                startIcon={<MaterialSymbol icon="mail" size="small" />}
              >
                Solicitar un nuevo enlace
              </Button>

              <button
                type="button"
                className="auth-text-btn mt-2"
                onClick={() => navigate(isAdmin ? "/admin/login" : "/usuario/login")}
              >
                Regresar al inicio de sesión
              </button>
            </div>
          )}

          {!validatingToken && tokenValido === true && (
            <>
              <div className="mt-3 d-flex flex-column gap-2" aria-live="polite">
                {error && (
                  <Alert
                    severity="error"
                    variant="outlined"
                    className="rounded-3"
                  >
                    {error}
                  </Alert>
                )}

                {successMessage && (
                  <Alert
                    severity="success"
                    variant="outlined"
                    className="rounded-3"
                  >
                    <div className="d-flex flex-column">
                      <span className="fw-semibold">
                        {successMessage}
                      </span>

                      <span className="fz-h5 text-muted">
                        Redirigiendo al inicio de sesión...
                      </span>
                    </div>
                  </Alert>
                )}
              </div>

              <div className="mt-3 d-flex flex-column gap-3">
                <TextField
                  fullWidth
                  required
                  name="codigo"
                  label="Código de verificación"
                  placeholder="Ingresa el código recibido"
                  value={codigo}
                  disabled={loading || Boolean(successMessage)}
                  error={codigoIsInvalid}
                  helperText={
                    codigoIsInvalid
                      ? "El código de verificación es obligatorio."
                      : "Revisa el código enviado a tu correo electrónico."
                  }
                  onBlur={() => setCodigoTouched(true)}
                  onChange={(event) => setCodigo(event.target.value)}
                  slotProps={{
                    htmlInput: {
                      maxLength: 100,
                      autoComplete: "one-time-code",
                    },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <MaterialSymbol
                            icon="key"
                            size="medium"
                            className="text-muted"
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  required
                  name="password"
                  label="Nueva contraseña"
                  placeholder="Ingresa tu nueva contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading || Boolean(successMessage)}
                  error={passwordIsInvalid}
                  helperText={
                    passwordIsInvalid
                      ? "La nueva contraseña es obligatoria."
                      : "Utiliza una contraseña segura que no hayas usado anteriormente."
                  }
                  onBlur={() => setPasswordTouched(true)}
                  onChange={(event) => setPassword(event.target.value)}
                  slotProps={{
                    htmlInput: {
                      maxLength: 150,
                      autoComplete: "new-password",
                    },
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <MaterialSymbol
                            icon="lock"
                            size="medium"
                            className="text-muted"
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            type="button"
                            edge="end"
                            size="small"
                            disabled={loading || Boolean(successMessage)}
                            aria-label={
                              showPassword
                                ? "Ocultar contraseña"
                                : "Mostrar contraseña"
                            }
                            onClick={() =>
                              setShowPassword((currentValue) => !currentValue)
                            }
                            onMouseDown={(event) => {
                              event.preventDefault();
                            }}
                          >
                            <MaterialSymbol
                              icon={
                                showPassword ? "visibility_off" : "visibility"
                              }
                              size="medium"
                            />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              </div>

              <div className="auth-divider my-3 text-center text-muted fz-h5">
                Actualización segura
              </div>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || formIsInvalid || Boolean(successMessage)}
                className="auth-submit-btn w-100"
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={18}
                      thickness={5}
                      className="text-white"
                    />
                  ) : (
                    <MaterialSymbol icon="lock_reset" size="small" />
                  )
                }
              >
                {loading
                  ? "Guardando contraseña..."
                  : successMessage
                    ? "Contraseña actualizada"
                    : "Cambiar contraseña"}
              </Button>

              <p className="auth-security-msg">
                <MaterialSymbol icon="verified_user" size="small" />

                <span>Tu nueva contraseña se almacenará de forma segura.</span>
              </p>
            </>
          )}
        </form>

        <Typography component="p" className="auth-footer-text mt-3">
          ¿Necesitas otro enlace?{" "}
          <button
            type="button"
            className="auth-text-btn"
            onClick={() =>
              navigate(
                isAdmin
                  ? "/admin/recuperar-contrasena"
                  : "/usuario/recuperar-contrasena",
              )
            }
          >
            Solicitar recuperación
          </button>
        </Typography>
      </div>
    </main>
  );
}

