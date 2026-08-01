import {
  Box,
  Container,
  Divider,
  Link,
  Paper,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { adminApi } from "../api/admin.api";
import { authApi } from "../api/authApi";
import LoginForm from "../components/forms/LoginForm";

import styles from "../styles/LoginPage.module.css";
import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";


const LOGO_URL =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

interface Props {
  type: "admin" | "user";
}

interface LoginError {
  response?: {
    data?: {
      mensaje?: string;
    };
  };
}

export default function LoginPage({ type }: Props) {
  const navigate = useNavigate();

  const isAdmin = type === "admin";

  const handleLogin = async (data: any) => {
    try {
      const response = isAdmin
        ? await adminApi.loginAdmin(data)
        : await authApi.login(data);

      const token = response.data?.respuesta?.token;

      if (!token) {
        throw new Error("La respuesta no contiene un token de autenticación.");
      }

      localStorage.setItem("token", token);

      await Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: isAdmin
          ? "Acceso administrativo autorizado."
          : "Has iniciado sesión correctamente.",
        timer: 1300,
        timerProgressBar: true,
        showConfirmButton: false,
      });

      navigate(isAdmin ? "/Admin" : "/app", {
        replace: true,
      });
    } catch (error: unknown) {
      const apiError = error as LoginError;

      await Swal.fire({
        icon: "error",
        title: "No pudimos iniciar sesión",
        text:
          apiError.response?.data?.mensaje ??
          "Correo o contraseña incorrectos.",
        confirmButtonText: "Intentar nuevamente",
        confirmButtonColor: "#007AFF",
      });
    }
  };

  return (
    <Box component="main" className={styles.loginPage}>
      <Box className={styles.backgroundDecoration} aria-hidden="true">
        <Box className={styles.decorationOne} />
        <Box className={styles.decorationTwo} />
        <Box className={styles.decorationThree} />
      </Box>

      <Container maxWidth="xs" className={styles.container}>
        <Link
          href="/"
          underline="none"
          className={styles.logoLink}
          aria-label="Ir al inicio de ADLocal"
        >
          <Box
            component="img"
            src={LOGO_URL}
            alt="ADLocal"
            className={styles.logo}
          />
        </Link>

        <Paper elevation={0} className={styles.loginCard}>
          <Box className={styles.loginHeader}>
            <Box
              className={[
                styles.headerIcon,
                isAdmin ? styles.adminHeaderIcon : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <MaterialSymbol
                icon={isAdmin ? "admin_panel_settings" : "account_circle"}
                size="large"
                filled
              />
            </Box>

            <Box className={styles.headerContent}>
              <Typography
                component="span"
                className={[
                  styles.loginType,
                  isAdmin ? styles.adminLoginType : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isAdmin ? "Portal administrativo" : "Cuenta ADLocal"}
              </Typography>

              <Typography component="h1" className={styles.title}>
                {isAdmin ? "Acceso administrador" : "Iniciar sesión"}
              </Typography>

              <Typography component="p" className={styles.description}>
                {isAdmin
                  ? "Ingresa tus credenciales para administrar la plataforma."
                  : "Accede a tu cuenta para administrar tu negocio y sus servicios."}
              </Typography>
            </Box>
          </Box>

          {!isAdmin && (
            <Box className={styles.registerMessage}>
              <Typography component="span" className={styles.registerText}>
                ¿Todavía no tienes una cuenta?
              </Typography>

              <Link
                component="button"
                type="button"
                underline="none"
                className={styles.textButton}
                onClick={() => navigate("/registro")}
              >
                Crear cuenta
              </Link>
            </Box>
          )}

          <Box className={styles.formContainer}>
            <LoginForm onSubmit={handleLogin} />
          </Box>

          <Link
            component="button"
            type="button"
            underline="none"
            className={styles.forgotPasswordButton}
            onClick={() => navigate("/recuperar-contrasena")}
          >
            <MaterialSymbol icon="lock_reset" size="small" />

            <span>¿Olvidaste tu contraseña?</span>
          </Link>

          {!isAdmin && (
            <>
              <Divider className={styles.divider}>Información legal</Divider>

              <Typography component="p" className={styles.terms}>
                Al iniciar sesión o crear una cuenta, aceptas nuestros{" "}
                <Link
                  href="/terminos"
                  underline="none"
                  className={styles.termsLink}
                >
                  Términos y Condiciones
                </Link>{" "}
                y la{" "}
                <Link
                  href="/privacidad"
                  underline="none"
                  className={styles.termsLink}
                >
                  Política de Privacidad
                </Link>
                .
              </Typography>
            </>
          )}
        </Paper>

        <Box className={styles.pageFooter}>
          <MaterialSymbol icon="verified_user" size="small" />

          <Typography component="span" className={styles.pageFooterText}>
            Tu información está protegida por ADLocal
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
