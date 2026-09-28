import { lazy, Suspense, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRouteUsuario from "./Auth/PublicRouteUsuario";
import PrivateRouteUsuario, {
  type JwtPayload,
} from "./Auth/PrivateRouteUsuario";
import UserLayout from "./Components/UsuarioLayout";
import { getLocalStorageJWTUsuario } from "../utils/storageUsuario";
import { jwtDecode } from "jwt-decode";
import PageLoader from "../components/UI/PageLoader";

// Lazy-loaded pages (Code-Splitting)
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const PreviewPage = lazy(() => import("./Pages/Home/PreviewPage"));
const PreviewNegocio = lazy(() =>
  import("./Pages/Home/PreviewNegocio").then((m) => ({
    default: m.PreviewNegocio,
  })),
);
const MiComercioPage = lazy(() =>
  import("./Pages/Comercio/MiComercioPage").then((m) => ({
    default: m.MiComercioPage,
  })),
);
const ComercioPageForm = lazy(() =>
  import("./Pages/Comercio/ComercioPageForm").then((m) => ({
    default: m.ComercioPageForm,
  })),
);
const NotFoundPage = lazy(() => import("../components/NotFoundPage"));
const UserProfilePage = lazy(() => import("./Pages/Perfil/UserProfilePage"));
const UserChangePasswordForm = lazy(() =>
  import("./Pages/Perfil/UserChangePasswordForm").then((m) => ({
    default: m.UserChangePasswordForm,
  })),
);
const ProductosServiciosPage = lazy(() =>
  import("./Pages/ProductosServicios/ProductosServiciosPage").then((m) => ({
    default: m.ProductosServiciosPage,
  })),
);
const ProductosServicioComercios = lazy(
  () => import("./Pages/ProductosServicios/ProductosServicioComercios"),
);
const ProductosServicioComercio = lazy(() =>
  import("./Pages/ProductosServicios/ProductosServicioComercio").then((m) => ({
    default: m.ProductosServicioComercio,
  })),
);
const ConfiguracionPagosPage = lazy(() =>
  import("./Pages/PagosComercio/ConfiguracionPagosPage").then((m) => ({
    default: m.ConfiguracionPagosPage,
  })),
);
const PlanesPage = lazy(() => import("./Pages/Plan/MiPlanPage"));
const PedidosComercioPage = lazy(() =>
  import("./Pages/Pedidos/PedidosComercioPage").then((m) => ({
    default: m.PedidosComercioPage,
  })),
);
const ComisionesComercioPage = lazy(() =>
  import("./Pages/Comisiones/ComisionesComercioPage").then((m) => ({
    default: m.ComisionesComercioPage,
  })),
);
const CitasComercioPage = lazy(() =>
  import("./Pages/Citas/CitasComercioPage").then((m) => ({
    default: m.CitasComercioPage,
  })),
);

export default function AppUser() {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const updateUserFromStorage = () => {
      const token = getLocalStorageJWTUsuario();
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          setUser(decoded);
        } catch {
          setUser(null);
        }
      }
    };

    updateUserFromStorage();

    const handleTokenRefreshed = (e: Event) => {
      const customEvent = e as CustomEvent<{
        token?: string;
        userType?: string;
      }>;
      if (
        customEvent.detail?.userType === "usuario" &&
        customEvent.detail?.token
      ) {
        try {
          const decoded = jwtDecode<JwtPayload>(customEvent.detail.token);
          setUser(decoded);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("adlocal_token_refreshed", handleTokenRefreshed);
    return () => {
      window.removeEventListener(
        "adlocal_token_refreshed",
        handleTokenRefreshed,
      );
    };
  }, []);

  return (
    <Suspense fallback={<PageLoader message="Cargando..." />}>
      <Routes>
        <Route index element={<Navigate to="/usuario/login" replace />} />

        <Route
          path="/login"
          element={
            <PublicRouteUsuario>
              <LoginPage type="user" />
            </PublicRouteUsuario>
          }
        />
        <Route
          path="/crear-cuenta"
          element={
            <PublicRouteUsuario>
              <RegisterPage type="user" />
            </PublicRouteUsuario>
          }
        />

        <Route
          path="/recuperar-contrasena"
          element={
            <PublicRouteUsuario>
              <ForgotPasswordPage type="user" />
            </PublicRouteUsuario>
          }
        />

        <Route
          path="restablecer-contrasena/:token/:type"
          element={
            <PublicRouteUsuario>
              <ResetPasswordPage />
            </PublicRouteUsuario>
          }
        />

        <Route
          path="/app"
          element={
            <PrivateRouteUsuario roles={["Comercio", "Colaborador"]}>
              <UserLayout />
            </PrivateRouteUsuario>
          }
        >
          <Route
            index
            element={
              user?.rol !== "Colaborador" ? (
                <PreviewPage user={user} />
              ) : (
                <PreviewNegocio />
              )
            }
          />
          <Route
            path="inicio"
            element={
              user?.rol !== "Colaborador" ? (
                <PreviewPage user={user} />
              ) : (
                <PreviewNegocio />
              )
            }
          />
          <Route path="comercio" element={<MiComercioPage user={user} />} />
          {user?.rol !== "Colaborador" && (
            <>
              <Route
                path="comercio/editar/:id"
                element={<ComercioPageForm user={user} />}
              />
              <Route
                path="comercio/nuevo"
                element={<ComercioPageForm user={user} />}
              />
            </>
          )}

          <Route path="perfil" element={<UserProfilePage />} />
          <Route
            path="perfil/cambiar-password"
            element={<UserChangePasswordForm />}
          />
          <Route
            path="productos-servicios"
            element={<ProductosServiciosPage />}
          />
          <Route
            path="productos-servicios/comercios"
            element={<ProductosServicioComercios />}
          />
          <Route
            path="productos-servicios/comercios/comercio/:id"
            element={<ProductosServicioComercio />}
          />
          <Route
            path="productos-servicios/comercio/:id"
            element={<ProductosServicioComercio />}
          />
          <Route
            path="configuracion-pagos"
            element={<ConfiguracionPagosPage />}
          />
          <Route path="pedidos" element={<PedidosComercioPage />} />
          <Route path="comisiones" element={<ComisionesComercioPage />} />
          <Route path="citas" element={<CitasComercioPage />} />
          {user?.rol !== "Colaborador" && (
            <Route path="plan" element={<PlanesPage user={user} />} />
          )}

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
