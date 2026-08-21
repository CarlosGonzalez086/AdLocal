import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "../styles/ResetPasswordPage.module.css";

import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";

const LOGO_URL =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

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

  // const { checkToken, newPassword, loading, error, successMessage } =
  //   useForgetPassword();

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

  /*
   * Redirigir únicamente cuando el hook confirma
   * que la contraseña se actualizó correctamente.
   */
  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const redirectTimeout = window.setTimeout(() => {
      navigate("/login", {
        replace: true,
      });
    }, 2000);

    return () => {
      window.clearTimeout(redirectTimeout);
    };
  }, [successMessage, navigate]);

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
    <Box component="main" className={styles.page}>
      <Box className={styles.backgroundDecoration} aria-hidden="true">
        <Box className={styles.decorationOne} />

        <Box className={styles.decorationTwo} />
      </Box>

      <Button
        type="button"
        variant="outlined"
        className={styles.backButton}
        onClick={() => navigate("/login")}
        startIcon={<MaterialSymbol icon="arrow_back_ios_new" size="small" />}
      >
        Regresar
      </Button>

      <Container maxWidth="xs" className={styles.container}>
        <Box
          component="a"
          href="/"
          className={styles.logoLink}
          aria-label="Ir al inicio de ADLocal"
        >
          <Box
            component="img"
            src={LOGO_URL}
            alt="ADLocal"
            className={styles.logo}
          />
        </Box>

        <Paper
          component="form"
          elevation={0}
          className={styles.card}
          onSubmit={handleSubmit}
          noValidate
        >
          <Box className={styles.header}>
            <Box className={styles.headerIcon}>
              <MaterialSymbol icon="password" size="large" />
            </Box>

            <Box className={styles.headerContent}>
              <Typography component="span" className={styles.eyebrow}>
                Seguridad de la cuenta
              </Typography>

              <Typography component="h1" className={styles.title}>
                Cambiar contraseña
              </Typography>

              <Typography component="p" className={styles.description}>
                Ingresa el código recibido en tu correo y establece una nueva
                contraseña para tu cuenta.
              </Typography>
            </Box>
          </Box>

          {validatingToken && (
            <Alert
              severity="info"
              variant="outlined"
              icon={
                <CircularProgress
                  size={18}
                  thickness={5}
                  className={styles.validationProgress}
                />
              }
              className={styles.alert}
            >
              Validando el enlace de recuperación...
            </Alert>
          )}

          {!validatingToken && tokenValido === false && (
            <Box className={styles.invalidTokenState}>
              <Box className={styles.invalidTokenIcon}>
                <MaterialSymbol icon="link_off" size="large" />
              </Box>

              <Typography component="h2" className={styles.invalidTokenTitle}>
                Enlace no válido
              </Typography>

              <Typography
                component="p"
                className={styles.invalidTokenDescription}
              >
                El enlace de recuperación no existe, ya expiró o fue utilizado
                anteriormente.
              </Typography>

              <Button
                type="button"
                variant="contained"
                fullWidth
                className={styles.requestLinkButton}
                onClick={() => navigate("/recuperar-contrasena")}
                startIcon={<MaterialSymbol icon="mail" size="small" />}
              >
                Solicitar un nuevo enlace
              </Button>

              <Button
                type="button"
                variant="text"
                className={styles.loginLinkButton}
                onClick={() => navigate("/login")}
              >
                Regresar al inicio de sesión
              </Button>
            </Box>
          )}

          {!validatingToken && tokenValido === true && (
            <>
              <Box className={styles.messages} aria-live="polite">
                {error && (
                  <Alert
                    severity="error"
                    variant="outlined"
                    className={styles.alert}
                  >
                    {error}
                  </Alert>
                )}

                {successMessage && (
                  <Alert
                    severity="success"
                    variant="outlined"
                    className={styles.alert}
                  >
                    <Box className={styles.successContent}>
                      <Typography
                        component="span"
                        className={styles.successMessage}
                      >
                        {successMessage}
                      </Typography>

                      <Typography
                        component="span"
                        className={styles.redirectMessage}
                      >
                        Redirigiendo al inicio de sesión...
                      </Typography>
                    </Box>
                  </Alert>
                )}
              </Box>

              <Box className={styles.fields}>
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
                  className={styles.textField}
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
                            className={styles.fieldIcon}
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
                  className={styles.textField}
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
                            className={styles.fieldIcon}
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
                            className={styles.visibilityButton}
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
              </Box>

              <Divider className={styles.divider}>Actualización segura</Divider>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || formIsInvalid || Boolean(successMessage)}
                className={styles.submitButton}
                startIcon={
                  loading ? (
                    <CircularProgress
                      size={18}
                      thickness={5}
                      className={styles.buttonProgress}
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

              <Typography component="p" className={styles.securityMessage}>
                <MaterialSymbol icon="verified_user" size="small" />

                <span>Tu nueva contraseña se almacenará de forma segura.</span>
              </Typography>
            </>
          )}
        </Paper>

        <Typography component="p" className={styles.footerText}>
          ¿Necesitas otro enlace?{" "}
          <Button
            type="button"
            variant="text"
            className={styles.footerButton}
            onClick={() => navigate("/recuperar-contrasena")}
          >
            Solicitar recuperación
          </Button>
        </Typography>
      </Container>
    </Box>
  );
}
