import { ChangePasswordForm } from "./components/profile/ChangePasswordForm";
import DashboardHome from "./pages/DashboardHome";
import { PlanesPage } from "./pages/Planes/PlanesPage";
import ProfilePage from "./pages/profile/ProfilePage";

export const protectedRoutes = [
  {
    path: "/",
    element: <DashboardHome />,
  },
  {
    path: "/planes",
    element: <PlanesPage />,
  },
  {
    path: "/usuarios",
    element: <>Usuarios</>,
  },
  {
    path: "/configuraciones",
    element: <>Configuraciones</>,
  },
  {
    path: "/historial-suscripciones",
    element: <>HistorialSuscripciones</>,
  },
  {
    path: "/perfil",
    element: <ProfilePage />,
  },
    {
    path: "/perfil/cambiar-password",
    element: <ChangePasswordForm />,
  },
];
