import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import PublicRouteAdmin from "./Auth/PublicRouteAdmin";
import PrivateRouteAdmin from "./Auth/PrivateRouteAdmin";
import AdminLayout from "./Components/AdminLayout";
import PageLoader from "../components/UI/PageLoader";

// Lazy-loaded Admin Pages (Code-Splitting)
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));

const DashboardHome = lazy(() =>
  import("./Pages/Dashboard/DashboardHome").then((m) => ({ default: m.DashboardHome })),
);
const PlanesPageAdmin = lazy(() =>
  import("./Pages/Planes/Components/PlanesPage").then((m) => ({
    default: m.PlanesPageAdmin,
  })),
);
const UsersPageAdmin = lazy(() =>
  import("./Pages/Usuarios/Components/UsersPage").then((m) => ({
    default: m.UsersPageAdmin,
  })),
);
const TiposComercioPageAdmin = lazy(() =>
  import("./Pages/TipoComercio/Components/TiposComercioPage").then((m) => ({
    default: m.TiposComercioPageAdmin,
  })),
);
const ConfiguracionSistemaPage = lazy(() =>
  import("./Pages/Configuraciones/Components/ConfiguracionSistemaPage").then((m) => ({
    default: m.ConfiguracionSistemaPage,
  })),
);
const SuscripcionesPage = lazy(() =>
  import("./Pages/Suscripciones/Components/SuscripcionesPage").then((m) => ({
    default: m.SuscripcionesPage,
  })),
);
const ProfilePage = lazy(() => import("./Pages/Perfil/Components/ProfilePage"));
const ChangePasswordPage = lazy(() =>
  import("./Pages/Perfil/Components/ChangePasswordPage").then((m) => ({
    default: m.ChangePasswordPage,
  })),
);
const ComisionesPage = lazy(() =>
  import("./Pages/Comisiones/ComisionesPage").then((m) => ({
    default: m.ComisionesPage,
  })),
);
const CuentasAdLocalPage = lazy(() =>
  import("./Pages/Comisiones/CuentasAdLocalPage").then((m) => ({
    default: m.CuentasAdLocalPage,
  })),
);

export default function AppAdmin() {
  return (
    <Suspense fallback={<PageLoader message="Cargando panel de administración..." />}>
      <Routes>
        <Route index element={<Navigate to="/admin/login" replace />} />
        {/* Públicas */}
        <Route
          path="/login"
          element={
            <PublicRouteAdmin>
              <LoginPage type="admin" />
            </PublicRouteAdmin>
          }
        />
        <Route
          path="/crear-cuenta"
          element={
            <PublicRouteAdmin>
              <RegisterPage type="admin" />
            </PublicRouteAdmin>
          }
        />

        <Route
          path="/recuperar-contrasena"
          element={
            <PublicRouteAdmin>
              <ForgotPasswordPage type="admin" />
            </PublicRouteAdmin>
          }
        />

        <Route
          path="/restablecer-contrasena"
          element={
            <PublicRouteAdmin>
              <ResetPasswordPage />
            </PublicRouteAdmin>
          }
        />
        {/* Privadas */}
        <Route
          path="/app"
          element={
            <PrivateRouteAdmin roles={["Admin"]}>
              <AdminLayout />
            </PrivateRouteAdmin>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="inicio" element={<DashboardHome />} />
          <Route path="planes" element={<PlanesPageAdmin />} />
          <Route path="usuarios" element={<UsersPageAdmin />} />
          <Route path="tipos-comercios" element={<TiposComercioPageAdmin />} />
          <Route path="configuraciones" element={<ConfiguracionSistemaPage />} />
          <Route path="historial-suscripciones" element={<SuscripcionesPage />} />
          <Route path="comisiones" element={<ComisionesPage />} />
          <Route path="cuentas-adlocal" element={<CuentasAdLocalPage />} />
          <Route path="perfil" element={<ProfilePage />} />
          <Route
            path="perfil/cambiar-contrasena"
            element={<ChangePasswordPage />}
          />
          <Route path="*" element={<>Página no encontrada</>} />
        </Route>
      </Routes>
    </Suspense>
  );
}
