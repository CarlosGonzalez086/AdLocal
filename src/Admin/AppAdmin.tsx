import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import RegisterPage from "../pages/RegisterPage";
import PublicRouteAdmin from "./Auth/PublicRouteAdmin";
import PrivateRouteAdmin from "./Auth/PrivateRouteAdmin";
import AdminLayout from "./Components/AdminLayout";
import { DashboardHome } from "./Pages/Dashboard/DashboardHome";
import { PlanesPageAdmin } from "./Pages/Planes/Components/PlanesPage";
import { UsersPageAdmin } from "./Pages/Usuarios/Components/UsersPage";
import { TiposComercioPageAdmin } from "./Pages/TipoComercio/Components/TiposComercioPage";
import { ConfiguracionSistemaPage } from "./Pages/Configuraciones/Components/ConfiguracionSistemaPage";
import { SuscripcionesPage } from "./Pages/Suscripciones/Components/SuscripcionesPage";
import ProfilePage from "./Pages/Perfil/Components/ProfilePage";
import { ChangePasswordPage } from "./Pages/Perfil/Components/ChangePasswordPage";
import { ComisionesPage } from "./Pages/Comisiones/ComisionesPage";
import { CuentasAdLocalPage } from "./Pages/Comisiones/CuentasAdLocalPage";

export default function AppAdmin() {
  return (
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
        <Route path="*" element={<>Pagina no encontrada</>} />
      </Route>
    </Routes>
  );
}
