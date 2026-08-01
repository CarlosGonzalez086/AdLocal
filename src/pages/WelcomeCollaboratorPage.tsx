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

import { useForgetPassword } from "../hooks/useForgetPassword";
import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";

import styles from "../styles/WelcomeCollaboratorPage.module.css";

const LOGO_URL =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

export default function WelcomeCollaboratorPage() {
  const { token } = useParams<{
    token: string;
  }>();

  const navigate = useNavigate();

  const { checkToken, newPassword, loading, error, successMessage } =
    useForgetPassword();

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

  useEffect(() => {
    let componentMounted = true;

    const validarToken = async () => {
      if (!token) {
        if (componentMounted) {
          setTokenValido(false);
          setValidatingToken(false);
        }

        return;
      }

      try {
        setValidatingToken(true);

        const esValido = await checkToken(token);

        if (componentMounted) {
          setTokenValido(Boolean(esValido));
        }
      } catch (validationError) {
        console.error(
          "Error al validar el enlace de bienvenida:",
          validationError,
        );

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

    if (formIsInvalid || loading || !tokenValido || successMessage) {
      return;
    }

    await newPassword({
      codigo: cleanCode,
      passwordNueva: password,
    });
  };

  return (
    <Box component="main" className={styles.page}>
      <Box className={styles.backgroundDecoration} aria-hidden="true">
        <Box className={styles.decorationOne} />

        <Box className={styles.decorationTwo} />

        <Box className={styles.decorationThree} />
      </Box>

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
              <MaterialSymbol icon="person_add" size="large" filled />
            </Box>

            <Box className={styles.headerContent}>
              <Typography component="span" className={styles.eyebrow}>
                Invitación de colaborador
              </Typography>

              <Typography component="h1" className={styles.title}>
                Bienvenido a ADLocal
              </Typography>

              <Typography component="p" className={styles.description}>
                Ingresa el código que recibiste y crea la contraseña que
                utilizarás para acceder a la plataforma.
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
              Validando tu invitación...
            </Alert>
          )}

          {!validatingToken && tokenValido === false && (
            <Box className={styles.invalidTokenState}>
              <Box className={styles.invalidTokenIcon}>
                <MaterialSymbol icon="person_off" size="large" />
              </Box>

              <Typography component="h2" className={styles.invalidTokenTitle}>
                Invitación no válida
              </Typography>

              <Typography
                component="p"
                className={styles.invalidTokenDescription}
              >
                El enlace de bienvenida no existe, ya expiró o fue utilizado
                anteriormente.
              </Typography>

              <Button
                type="button"
                variant="contained"
                fullWidth
                className={styles.loginButton}
                onClick={() => navigate("/login")}
                startIcon={<MaterialSymbol icon="login" size="small" />}
              >
                Ir al inicio de sesión
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
                  label="Código de bienvenida"
                  placeholder="Ingresa el código recibido"
                  value={codigo}
                  disabled={loading || Boolean(successMessage)}
                  error={codigoIsInvalid}
                  helperText={
                    codigoIsInvalid
                      ? "El código de bienvenida es obligatorio."
                      : "Utiliza el código enviado junto con tu invitación."
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
                  label="Crear contraseña"
                  placeholder="Ingresa tu contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={loading || Boolean(successMessage)}
                  error={passwordIsInvalid}
                  helperText={
                    passwordIsInvalid
                      ? "La contraseña es obligatoria."
                      : "Utiliza una contraseña segura para proteger tu cuenta."
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

              <Divider className={styles.divider}>Activación de cuenta</Divider>

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
                    <MaterialSymbol icon="person_check" size="small" />
                  )
                }
              >
                {loading
                  ? "Creando acceso..."
                  : successMessage
                    ? "Cuenta activada"
                    : "Crear contraseña y acceder"}
              </Button>

              <Typography component="p" className={styles.securityMessage}>
                <MaterialSymbol icon="verified_user" size="small" />

                <span>
                  Tu acceso quedará protegido y asociado a la invitación
                  recibida.
                </span>
              </Typography>
            </>
          )}
        </Paper>

        <Typography component="p" className={styles.footerText}>
          ¿Ya activaste tu cuenta?{" "}
          <Button
            type="button"
            variant="text"
            className={styles.footerButton}
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </Button>
        </Typography>
      </Container>
    </Box>
  );
}
