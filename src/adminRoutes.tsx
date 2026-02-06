import { ChangePasswordForm } from "./components/profile/ChangePasswordForm";
import { UsersPage } from "./pages/Admin/Users/UsersPage";
import ProfilePage from "./pages/Admin/profile/ProfilePage";
import { PlanesPage } from "./pages/Admin/Planes/PlanesPage";

import { ConfiguracionSistemaPage } from "./pages/Admin/configuracion/ConfiguracionSistemaPage";
import { SuscripcionesPage } from "./pages/Admin/Subscripciones/SuscripcionesPage";
import { DashboardHome } from "./pages/Admin/DashboardHome";
import { TiposComercioPage } from "./pages/Admin/TipoComercio/TipoComercioPage";

export const adminRoutes = [
  { path: "", element: <DashboardHome /> },
  { path: "planes", element: <PlanesPage /> },
  { path: "usuarios", element: <UsersPage /> },
  { path: "tipos-comercios", element: <TiposComercioPage /> },
  { path: "configuraciones", element: <ConfiguracionSistemaPage /> },
  { path: "historial-suscripciones", element: <SuscripcionesPage /> },
  { path: "perfil", element: <ProfilePage /> },
  { path: "perfil/cambiar-password", element: <ChangePasswordForm /> },
];
