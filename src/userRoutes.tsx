import { Elements } from "@stripe/react-stripe-js";
import { MiComercioPage } from "./pages/User/Comercio/MiComercioPage";
import { UserChangePasswordForm } from "./pages/User/Perfil/UserChangePasswordForm";
import UserProfilePage from "./pages/User/Perfil/UserProfilePage";
import PlanesPage from "./pages/User/Plan/MiPlanPage";
import { TarjetasPage } from "./pages/User/Tarjetas/TarjetasPage";
import { loadStripe } from "@stripe/stripe-js";
import { ProductosServiciosPage } from "./pages/User/ProductosServicios/ProductosServiciosPage";
import PreviewPage from "./pages/User/Preview/PreviewPage";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const userRoutes = [
  {
    path: "",
    element: <PreviewPage />,
  },

  {
    path: "comercio",
    element: <MiComercioPage />,
  },

  {
    path: "plan",
    element: <PlanesPage />,
  },

  // {
  //   path: "pagos",
  //   element: <>Pagos</>,
  // },
  {
    path: "productos-servicios",
    element: <ProductosServiciosPage />,
  },

  {
    path: "tarjetas",
    element: (
      <Elements stripe={stripePromise}>
        <TarjetasPage />
      </Elements>
    ),
  },

  // {
  //   path: "configuracion",
  //   element: <>Configuración</>,
  // },

  {
    path: "perfil",
    element: <UserProfilePage />,
  },

  {
    path: "perfil/cambiar-password",
    element: <UserChangePasswordForm />,
  },
];
