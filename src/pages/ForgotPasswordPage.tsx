import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useForgetPassword } from "../hooks/useForgetPassword";
import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";

import styles from "../styles/ForgotPasswordPage.module.css";

const LOGO_URL =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const navigate = useNavigate();

  const {
    forgetPassword,
    loading,
    error,
    successMessage,
  } = useForgetPassword();

  const cleanEmail = email.trim();

  const emailIsEmpty = cleanEmail.length === 0;

  const emailIsInvalid =
    !emailIsEmpty && !EMAIL_REGEX.test(cleanEmail);

  const showEmailError =
    emailTouched && (emailIsEmpty || emailIsInvalid);

  const emailHelperText = showEmailError
    ? emailIsEmpty
      ? "El correo electrónico es obligatorio."
      : "Ingresa un correo electrónico válido."
    : "Te enviaremos las instrucciones a este correo.";

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setEmailTouched(true);

    if (
      emailIsEmpty ||
      emailIsInvalid ||
      loading
    ) {
      return;
    }

    await forgetPassword(cleanEmail);
  };

  return (
    <Box
      component="main"
      className={styles.page}
    >
      <Box
        className={styles.backgroundDecoration}
        aria-hidden="true"
      >
        <Box className={styles.decorationOne} />
        <Box className={styles.decorationTwo} />
      </Box>

      <Button
        type="button"
        variant="outlined"
        className={styles.backButton}
        onClick={() => navigate("/login")}
        startIcon={
          <MaterialSymbol
            icon="arrow_back_ios_new"
            size="small"
          />
        }
      >
        Regresar
      </Button>

      <Container
        maxWidth="xs"
        className={styles.container}
      >
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
              <MaterialSymbol
                icon="lock_reset"
                size="large"
              />
            </Box>

            <Box className={styles.headerContent}>
              <Typography
                component="span"
                className={styles.eyebrow}
              >
                Seguridad de la cuenta
              </Typography>

              <Typography
                component="h1"
                className={styles.title}
              >
                Recuperar contraseña
              </Typography>

              <Typography
                component="p"
                className={styles.description}
              >
                Ingresa el correo asociado a tu cuenta y te
                enviaremos un enlace para crear una nueva
                contraseña.
              </Typography>
            </Box>
          </Box>

          <Box
            className={styles.messages}
            aria-live="polite"
          >
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
                {successMessage}
              </Alert>
            )}
          </Box>

          <TextField
            fullWidth
            required
            type="email"
            name="email"
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={email}
            error={showEmailError}
            helperText={emailHelperText}
            disabled={loading}
            autoComplete="email"
            className={styles.emailField}
            onBlur={() => setEmailTouched(true)}
            onChange={(event) => {
              setEmail(event.target.value);

              if (!emailTouched) {
                return;
              }

              setEmailTouched(true);
            }}
            slotProps={{
              htmlInput: {
                inputMode: "email",
                maxLength: 150,
              },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MaterialSymbol
                      icon="mail"
                      size="medium"
                      className={styles.fieldIcon}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Divider className={styles.divider}>
            Verificación por correo
          </Divider>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={
              loading ||
              emailIsEmpty ||
              emailIsInvalid
            }
            className={styles.submitButton}
            startIcon={
              loading ? (
                <CircularProgress
                  size={18}
                  thickness={5}
                  className={styles.buttonProgress}
                />
              ) : (
                <MaterialSymbol
                  icon="send"
                  size="small"
                />
              )
            }
          >
            {loading
              ? "Enviando correo..."
              : "Enviar correo"}
          </Button>

          <Typography
            component="p"
            className={styles.securityMessage}
          >
            <MaterialSymbol
              icon="verified_user"
              size="small"
            />

            <span>
              Por seguridad, el enlace tendrá un tiempo
              limitado de vigencia.
            </span>
          </Typography>
        </Paper>

        <Typography
          component="p"
          className={styles.footerText}
        >
          ¿Recordaste tu contraseña?{" "}
          <Button
            type="button"
            variant="text"
            className={styles.loginButton}
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </Button>
        </Typography>
      </Container>
    </Box>
  );
}