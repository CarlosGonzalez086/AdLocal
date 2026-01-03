import { MiComercioPage } from "./pages/User/Comercio/MiComercioPage";
import { UserChangePasswordForm } from "./pages/User/Perfil/UserChangePasswordForm";
import UserProfilePage from "./pages/User/Perfil/UserProfilePage";

export const userRoutes = [
  {
    path: "",
    element: <>Inicio Usuario</>,
  },

  {
    path: "comercio",
    element: <MiComercioPage />,
  },

  {
    path: "plan",
    element: <>Mi Plan</>,
  },

  {
    path: "pagos",
    element: <>Pagos</>,
  },

  {
    path: "configuracion",
    element: <>Configuración</>,
  },

  {
    path: "perfil",
    element: <UserProfilePage />,
  },

  {
    path: "perfil/cambiar-password",
    element: <UserChangePasswordForm />,
  },
];
