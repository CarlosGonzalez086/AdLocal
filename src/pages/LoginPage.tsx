import { useNavigate } from "react-router-dom";
import Swal from "../utils/sweetalert";

import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";

import LoginForm, { type LoginFormData } from "../components/forms/LoginForm";
import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";

import { setLocalStorageJWTAdmin } from "../utils/storageAdmin";
import { setLocalStorageJWTUsuario } from "../utils/storageUsuario";
import { ADLOCAL_LOGO_URL } from "../constants/brand";

interface Props {
  type: "admin" | "user";
}

export default function LoginPage({ type }: Props) {
  const navigate = useNavigate();

  const isAdmin = type === "admin";

  const admin = useAdmin();
  const user = useUser();

  const loading = isAdmin ? admin.loading : user.loading;

  const handleLogin = async (data: LoginFormData) => {
    try {
      const response = isAdmin
        ? await admin.loginAdmin(data)
        : await user.loginUser(data);

      const loginResponse = response as unknown as {
        respuesta?: { token?: string };
        token?: string;
      } | undefined;
      const token = loginResponse?.respuesta?.token ?? loginResponse?.token;
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
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-bg-decoration" aria-hidden="true">
        <div className="auth-decoration-1" />
        <div className="auth-decoration-2" />
        <div className="auth-decoration-3" />
      </div>

      <div className="container auth-container" style={{ maxWidth: "440px" }}>
        <a
          href="/"
          className="auth-logo-link"
          aria-label="Ir al inicio de ADLocal"
        >
          <img
            src={ADLOCAL_LOGO_URL}
            alt="ADLocal"
            className="auth-logo-img"
          />
        </a>

        <div className="auth-card">
          <div className="auth-header">
            <div
              className={[
                "auth-header-icon",
                isAdmin ? "auth-header-icon--admin" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <MaterialSymbol
                icon={isAdmin ? "admin_panel_settings" : "account_circle"}
                size="large"
                filled
              />
            </div>

            <div className="auth-header-content">
              <span
                className={[
                  "auth-eyebrow",
                  isAdmin ? "auth-eyebrow--admin" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {isAdmin ? "Portal administrativo" : "Cuenta ADLocal"}
              </span>

              <h1 className="auth-title">
                {isAdmin ? "Acceso administrador" : "Iniciar sesión"}
              </h1>

              <p className="auth-description">
                {isAdmin
                  ? "Ingresa tus credenciales para administrar la plataforma."
                  : "Accede a tu cuenta para administrar tu negocio y sus servicios."}
              </p>
            </div>
          </div>

          {!isAdmin && (
            <div className="auth-message-banner">
              <span className="auth-message-text">
                ¿Todavía no tienes una cuenta?
              </span>

              <button
                type="button"
                className="auth-text-btn"
                onClick={() =>
                  navigate(
                    type === "user"
                      ? "/usuario/crear-cuenta"
                      : "/admin/crear-cuenta",
                  )
                }
              >
                Crear cuenta
              </button>
            </div>
          )}

          <div className="auth-form-container">
            <LoginForm onSubmit={handleLogin} loading={loading} />
          </div>

          <button
            type="button"
            className="auth-forgot-password-btn"
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
          </button>

          {!isAdmin && (
            <>
              <div className="auth-divider my-3 text-center text-muted fz-h5">
                Información legal
              </div>

              <p className="auth-terms">
                Al iniciar sesión o crear una cuenta, aceptas nuestros{" "}
                <a
                  href="/terminos"
                  className="auth-terms-link"
                >
                  Términos y Condiciones
                </a>{" "}
                y la{" "}
                <a
                  href="/privacidad"
                  className="auth-terms-link"
                >
                  Política de Privacidad
                </a>
                .
              </p>
            </>
          )}
        </div>

        <div className="auth-footer">
          <MaterialSymbol icon="verified_user" size="small" />

          <span className="auth-footer-text">
            Tu información está protegida por ADLocal
          </span>
        </div>
      </div>
    </main>
  );
}

