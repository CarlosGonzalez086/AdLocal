import DashboardHome from "./pages/DashboardHome";
import { PlanesPage } from "./pages/Planes/PlanesPage";


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
];
