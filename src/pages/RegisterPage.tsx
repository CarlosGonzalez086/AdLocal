import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { sendWelcomeEmail } from "../api/authApi";
import { useAdmin } from "../hooks/useAdmin";
import { useUser } from "../hooks/useUser";
import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";
import FormRegister from "../components/forms/FormRegister";

const LOGO_URL = "/logo-adlocal.png";

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
          confirmButtonColor: "#008989",
        });
      }

      navigate(isAdmin ? "/admin/login" : "/usuario/login", {
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
          href={type === "admin" ? "/admin/login" : "/usuario/login"}
          className="auth-logo-link"
          aria-label="Ir al inicio de ADLocal"
        >
          <img
            src={LOGO_URL}
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
                icon={isAdmin ? "admin_panel_settings" : "person_add"}
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
                {isAdmin ? "Administración del sistema" : "Registro ADLocal"}
              </span>

              <h1 className="auth-title">
                {isAdmin ? "Crear administrador" : "Crear cuenta"}
              </h1>

              <p className="auth-description">
                {isAdmin
                  ? "Registra una cuenta con permisos para administrar la plataforma."
                  : "Completa tus datos para comenzar a publicar y administrar tu negocio."}
              </p>
            </div>
          </div>

          {!isAdmin && (
            <div className="auth-message-banner">
              <span className="auth-message-text">
                ¿Ya tienes una cuenta?
              </span>

              <button
                type="button"
                className="auth-text-btn"
                onClick={() =>
                  navigate(type === "user" ? "/usuario/login" : "/admin/login")
                }
              >
                Inicia sesión
              </button>
            </div>
          )}

          <div className="auth-form-container">
            <FormRegister
              onSubmit={handleCreate}
              type={type}
              isFormCode={type === "user"}
              loading={loading}
            />
          </div>

          {isAdmin ? (
            <div className="auth-admin-notice">
              <div className="auth-admin-notice-icon">
                <MaterialSymbol icon="shield_person" size="medium" />
              </div>

              <p className="auth-admin-notice-text">
                Esta cuenta tendrá acceso a funciones administrativas. Verifica
                cuidadosamente la información antes de continuar.
              </p>
            </div>
          ) : (
            <>
              <div className="auth-divider my-3 text-center text-muted fz-h5">
                Información legal
              </div>

              <p className="auth-terms">
                Al crear una cuenta, aceptas nuestros{" "}
                <a
                  href="/terminos"
                  className="auth-terms-link"
                >
                  Términos de servicio
                </a>{" "}
                y la{" "}
                <a
                  href="/privacidad"
                  className="auth-terms-link"
                >
                  Política de privacidad
                </a>
                .
              </p>
            </>
          )}
        </div>

        <div className="auth-footer">
          <MaterialSymbol icon="verified_user" size="small" />

          <span className="auth-footer-text">
            Registro protegido por ADLocal
          </span>
        </div>
      </div>
    </main>
  );
}

