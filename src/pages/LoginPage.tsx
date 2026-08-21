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

import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";

import LoginForm from "../components/forms/LoginForm";
import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";

import styles from "../styles/LoginPage.module.css";
import { setLocalStorageJWTAdmin } from "../utils/storageAdmin";
import { setLocalStorageJWTUsuario } from "../utils/storageUsuario";

const LOGO_URL =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

interface Props {
  type: "admin" | "user";
}

export default function LoginPage({ type }: Props) {
  const navigate = useNavigate();

  const isAdmin = type === "admin";

  // Siempre se ejecutan los hooks
  const admin = useAdmin();
  const user = useUser();

  const loading = isAdmin ? admin.loading : user.loading;

  const handleLogin = async (data: any) => {
    try {
      const response = isAdmin
        ? await admin.loginAdmin(data)
        : await user.loginUser(data);

      const token = response.respuesta.token;
      console.log(token);
      if (!token) {
        await Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: "Por favor, inténtalo nuevamente.",
        });
        return;
      }

      if (isAdmin) {
        setLocalStorageJWTAdmin(token);
      } else {
        setLocalStorageJWTUsuario(token);
      }

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

      navigate(isAdmin ? "/admin/app/inicio" : "/usuario/app/inicio", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      // El hook ya muestra el mensaje de error.
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
                onClick={() =>
                  navigate(
                    type === "user"
                      ? "/usuario/crear-cuenta"
                      : "/admin/crear-cuenta",
                  )
                }
              >
                Crear cuenta
              </Link>
            </Box>
          )}

          <Box className={styles.formContainer}>
            <LoginForm onSubmit={handleLogin} loading={loading} />
          </Box>

          <Link
            component="button"
            type="button"
            underline="none"
            className={styles.forgotPasswordButton}
            onClick={() =>
              navigate(
                type === "user"
                  ? "/usuario/recuperar-contrasena"
                  : "/admin/recuperar-contrasena",
              )
            }
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
