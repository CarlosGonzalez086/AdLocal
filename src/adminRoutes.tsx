import { ChangePasswordForm } from "./components/profile/ChangePasswordForm";
import { UsersPage } from "./pages/Admin/Users/UsersPage";
import ProfilePage from "./pages/Admin/profile/ProfilePage";
import { PlanesPage } from "./pages/Admin/Planes/PlanesPage";
import DashboardHome from "./pages/Admin/DashboardHome";
import { ConfiguracionSistemaPage } from "./pages/Admin/configuracion/ConfiguracionSistemaPage";

export const adminRoutes = [
  { path: "", element: <DashboardHome /> },
  { path: "planes", element: <PlanesPage /> },
  { path: "usuarios", element: <UsersPage /> },
  { path: "configuraciones", element: <ConfiguracionSistemaPage /> },
  { path: "historial-suscripciones", element: <>HistorialSuscripciones</> },
  { path: "perfil", element: <ProfilePage /> },
  { path: "perfil/cambiar-password", element: <ChangePasswordForm /> },
];
