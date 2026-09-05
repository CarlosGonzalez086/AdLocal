import {
  Alert,
  Button,
  CircularProgress,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";
import Swal from "sweetalert2";

const LOGO_URL = "/logo-adlocal.png";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  type: "admin" | "user";
}

export default function ForgotPasswordPage({ type }: Props) {
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);

  const navigate = useNavigate();
  const isAdmin = type === "admin";
  const admin = useAdmin();
  const user = useUser();
  const loading = isAdmin ? admin.loading : user.loading;
  const cleanEmail = email.trim();
  const emailIsEmpty = cleanEmail.length === 0;
  const emailIsInvalid = !emailIsEmpty && !EMAIL_REGEX.test(cleanEmail);
  const showEmailError = emailTouched && (emailIsEmpty || emailIsInvalid);
  const emailHelperText = showEmailError
    ? emailIsEmpty
      ? "El correo electrónico es obligatorio."
      : "Ingresa un correo electrónico válido."
    : "Te enviaremos las instrucciones a este correo.";
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setEmailTouched(true);

    if (emailIsEmpty || emailIsInvalid || loading) {
      return;
    }

    try {
      const response = isAdmin
        ? await admin.forgetPassword({ email: cleanEmail })
        : await user.forgetPassword({ email: cleanEmail });

      const data = response as any;

      if (data.codigo !== "200") {
        setError(data.mensaje || "Ocurrió un error inesperado.");
        setSuccessMessage("");
        return;
      }
      setSuccessMessage(data.mensaje);
      Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: data.mensaje,
      });
    } catch (error: any) {
      console.error(error);
      setError(error.message || "Ocurrió un error inesperado.");
      setSuccessMessage("");
      Swal.fire({
        icon: "error",
        title: "Error al enviar correo",
        text: error.message || "Ocurrió un error inesperado.",
      });
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
        onClick={() =>
          navigate(type === "user" ? "/usuario/login" : "/admin/login")
        }
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
              <MaterialSymbol icon="lock_reset" size="large" />
            </div>

            <div className="auth-header-content">
              <span className="auth-eyebrow">
                Seguridad de la cuenta
              </span>

              <h1 className="auth-title">
                Recuperar contraseña
              </h1>

              <p className="auth-description">
                Ingresa el correo asociado a tu cuenta y te enviaremos un enlace
                para crear una nueva contraseña.
              </p>
            </div>
          </div>

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
                {successMessage}
              </Alert>
            )}
          </div>

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
            className="mt-3"
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
                      className="text-muted"
                    />
                  </InputAdornment>
                ),
              },
            }}
          />

          <div className="auth-divider my-3 text-center text-muted fz-h5">
            Verificación por correo
          </div>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || emailIsEmpty || emailIsInvalid}
            className="auth-submit-btn w-100"
            startIcon={
              loading ? (
                <CircularProgress
                  size={18}
                  thickness={5}
                  className="text-white"
                />
              ) : (
                <MaterialSymbol icon="send" size="small" />
              )
            }
          >
            {loading ? "Enviando correo..." : "Enviar correo"}
          </Button>

          <p className="auth-security-msg">
            <MaterialSymbol icon="verified_user" size="small" />

            <span>
              Por seguridad, el enlace tendrá un tiempo limitado de vigencia.
            </span>
          </p>
        </form>

        <Typography component="p" className="auth-footer-text mt-3">
          ¿Recordaste tu contraseña?{" "}
          <button
            type="button"
            className="auth-text-btn"
            onClick={() => navigate(type === "user" ? "/usuario/login" : "/admin/login")}
          >
            Iniciar sesión
          </button>
        </Typography>
      </div>
    </main>
  );
}

