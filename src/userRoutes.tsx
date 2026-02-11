import { Elements } from "@stripe/react-stripe-js";
import { MiComercioPage } from "./pages/User/Comercio/MiComercioPage";
import { UserChangePasswordForm } from "./pages/User/Perfil/UserChangePasswordForm";
import UserProfilePage from "./pages/User/Perfil/UserProfilePage";
import PlanesPage from "./pages/User/Plan/MiPlanPage";
import { TarjetasPage } from "./pages/User/Tarjetas/TarjetasPage";
import { ProductosServiciosPage } from "./pages/User/ProductosServicios/ProductosServiciosPage";
import PreviewPage from "./pages/User/Preview/PreviewPage";
import type { JwtClaims } from "./services/auth.api";
import { jwtDecode } from "jwt-decode";
import UpgradePlanPage from "./pages/User/UpgradePlanPage";
// import { CheckoutRedirectPage } from "./pages/User/checkout/CheckoutRedirectPage";
import { CheckoutSuccessPage } from "./pages/User/checkout/CheckoutSuccessPage";
import { CheckoutCancelPage } from "./pages/User/checkout/CheckoutCancelPage";
import { ComercioPageForm } from "./pages/User/Comercio/ComercioPageForm";
import { PreviewNegocio } from "./pages/User/Preview/PreviewNegocio";
import ProductosServicioComercios from "./pages/User/ProductosServicios/ProductosServicioComercios";
import { ProductosServicioComercio } from "./pages/User/ProductosServicios/ProductosServicioComercio";
import { stripePromise } from "./utils/stripe";

const dataJwt = localStorage.getItem("token");
const claims: JwtClaims | null = dataJwt ? jwtDecode<JwtClaims>(dataJwt) : null;
const puedeVerComercios =
  claims?.rol !== "Colaborador" &&
  (claims?.planTipo === "PRO" || claims?.planTipo === "BUSINESS");
console.log(puedeVerComercios);

const permiteCatalogo = claims?.permiteCatalogo !== "False";

export const userRoutes = [
  {
    path: "",
    element: <PreviewPage />,
  },
  claims?.rol !== "Colaborador" && {
    path: "vistaprevia/:id",
    element: <PreviewNegocio />,
  },
  // {
  //   path: "checkout/redirect",
  //   element: <CheckoutRedirectPage />,
  // },
  {
    path: "checkout/success",
    element: <CheckoutSuccessPage />,
  },
  {
    path: "checkout/cancel",
    element: <CheckoutCancelPage />,
  },
  {
    path: "comercio",
    element: <MiComercioPage />,
  },
  claims?.rol !== "Colaborador" && {
    path: "comercio/editar/:id",
    element: <ComercioPageForm />,
  },
  claims?.rol !== "Colaborador" && {
    path: "comercio/nuevo",
    element: <ComercioPageForm />,
  },
  claims?.rol !== "Colaborador" && {
    path: "plan",
    element: <PlanesPage />,
  },

  {
    path: "productos-servicios",
    element: permiteCatalogo ? <ProductosServiciosPage /> : <UpgradePlanPage />,
  },
  puedeVerComercios && {
    path: "productos-servicios/comercios",
    element: permiteCatalogo ? (
      <ProductosServicioComercios />
    ) : (
      <UpgradePlanPage />
    ),
  },

  puedeVerComercios && {
    path: "productos-servicios/comercios/comercio/:id",
    element: permiteCatalogo ? (
      <ProductosServicioComercio />
    ) : (
      <UpgradePlanPage />
    ),
  },

  claims?.rol !== "Colaborador" && {
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
