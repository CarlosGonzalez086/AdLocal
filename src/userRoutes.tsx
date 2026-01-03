import { MiComercioPage } from "./pages/User/Comercio/MiComercioPage";

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
    element: <>User Perfil</>,
  },

  {
    path: "perfil/cambiar-password",
    element: <>User Contraseña</>,
  },
];
