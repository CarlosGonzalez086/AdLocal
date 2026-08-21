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
import { sendWelcomeEmail } from "../api/authApi";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";
import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";
import styles from "../styles/RegisterPage.module.css";
import FormRegister from "../components/forms/FormRegister";

const LOGO_URL =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

interface Props {
  type: "admin" | "user";
}

export default function RegisterPage({ type }: Props) {
  const navigate = useNavigate();

  const isAdmin = type === "admin";

  const admin = useAdmin();
  const user = useUser();

  const loading = isAdmin ? admin.loading : user.loading;

  const handleCreate = async (data: any) => {
    try {
      const response = isAdmin
        ? await admin.crearAdmin(data)
        : await user.crearUser(data);

      const createdAccount: any = response?.respuesta;

      let welcomeEmailFailed = false;

      if (!isAdmin) {
        const accountName = createdAccount?.nombre;
        const accountEmail = createdAccount?.email;

        if (accountName && accountEmail) {
          try {
            await sendWelcomeEmail(accountName, accountEmail);
          } catch (emailError) {
            console.error(
              "No fue posible enviar el correo de bienvenida:",
              emailError,
            );

            welcomeEmailFailed = true;
          }
        } else {
          welcomeEmailFailed = true;
        }
      }

      if (welcomeEmailFailed) {
        await Swal.fire({
          icon: "warning",
          title: "Cuenta creada",
          text: "La cuenta fue creada correctamente, pero no fue posible enviar el correo de bienvenida.",
          confirmButtonText: "Continuar",
          confirmButtonColor: "#007AFF",
        });
      }

      navigate(isAdmin ? "/admin/login" : "/usuario/login", {
        replace: true,
      });
    } catch (error) {
      console.error(error);
      // Los hooks ya muestran el mensaje de error correspondiente.
    }
  };

  return (
    <Box component="main" className={styles.page}>
      <Box className={styles.backgroundDecoration} aria-hidden="true">
        <Box className={styles.decorationOne} />
        <Box className={styles.decorationTwo} />
        <Box className={styles.decorationThree} />
      </Box>

      <Container maxWidth="xs" className={styles.container}>
        <Link
          href={type === "admin" ? "/admin/login" : "/usuario/login"}
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

        <Paper elevation={0} className={styles.card}>
          <Box className={styles.header}>
            <Box
              className={[
                styles.headerIcon,
                isAdmin ? styles.adminHeaderIcon : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <MaterialSymbol
                icon={isAdmin ? "admin_panel_settings" : "person_add"}
                size="large"
                filled
              />
            </Box>

            <Box className={styles.headerContent}>
              <Typography
                component="span"
                className={[styles.eyebrow, isAdmin ? styles.adminEyebrow : ""]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isAdmin ? "Administración del sistema" : "Registro ADLocal"}
              </Typography>

              <Typography component="h1" className={styles.title}>
                {isAdmin ? "Crear administrador" : "Crear cuenta"}
              </Typography>

              <Typography component="p" className={styles.description}>
                {isAdmin
                  ? "Registra una cuenta con permisos para administrar la plataforma."
                  : "Completa tus datos para comenzar a publicar y administrar tu negocio."}
              </Typography>
            </Box>
          </Box>

          {!isAdmin && (
            <Box className={styles.loginMessage}>
              <Typography component="span" className={styles.loginMessageText}>
                ¿Ya tienes una cuenta?
              </Typography>

              <Link
                component="button"
                type="button"
                underline="none"
                className={styles.loginLink}
                onClick={() =>
                  navigate(type === "user" ? "/usuario/login" : "/admin/login")
                }
              >
                Inicia sesión
              </Link>
            </Box>
          )}

          <Box className={styles.formContainer}>
            <FormRegister
              onSubmit={handleCreate}
              type={type}
              isFormCode={type === "user"}
              loading={loading}
            />
          </Box>

          {isAdmin ? (
            <Box className={styles.adminNotice}>
              <Box className={styles.adminNoticeIcon}>
                <MaterialSymbol icon="shield_person" size="medium" />
              </Box>

              <Typography component="p" className={styles.adminNoticeText}>
                Esta cuenta tendrá acceso a funciones administrativas. Verifica
                cuidadosamente la información antes de continuar.
              </Typography>
            </Box>
          ) : (
            <>
              <Divider className={styles.divider}>Información legal</Divider>

              <Typography component="p" className={styles.terms}>
                Al crear una cuenta, aceptas nuestros{" "}
                <Link
                  href="/terminos"
                  underline="none"
                  className={styles.termsLink}
                >
                  Términos de servicio
                </Link>{" "}
                y la{" "}
                <Link
                  href="/privacidad"
                  underline="none"
                  className={styles.termsLink}
                >
                  Política de privacidad
                </Link>
                .
              </Typography>
            </>
          )}
        </Paper>

        <Box className={styles.footer}>
          <MaterialSymbol icon="verified_user" size="small" />

          <Typography component="span" className={styles.footerText}>
            Registro protegido por ADLocal
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
