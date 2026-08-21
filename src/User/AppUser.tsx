import { Navigate, Route, Routes } from "react-router-dom";
import PublicRouteUsuario from "./Auth/PublicRouteUsuario";
import LoginPage from "../pages/LoginPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import PrivateRouteUsuario, {
  type JwtPayload,
} from "./Auth/PrivateRouteUsuario";
import UserLayout from "./Components/UsuarioLayout";
import RegisterPage from "../pages/RegisterPage";
import { useEffect, useState } from "react";
import { getLocalStorageJWTUsuario } from "../utils/storageUsuario";
import { jwtDecode } from "jwt-decode";
import PreviewPage from "./Pages/Home/PreviewPage";
import { PreviewNegocio } from "./Pages/Home/PreviewNegocio";
import { MiComercioPage } from "./Pages/Comercio/MiComercioPage";
import { ComercioPageForm } from "./Pages/Comercio/ComercioPageForm";
import NotFoundPage from "../components/NotFoundPage";
import UserProfilePage from "./Pages/Perfil/UserProfilePage";
import { UserChangePasswordForm } from "./Pages/Perfil/UserChangePasswordForm";
import { ProductosServiciosPage } from "./Pages/ProductosServicios/ProductosServiciosPage";
import { ConfiguracionPagosPage } from "./Pages/PagosComercio/ConfiguracionPagosPage";
import { PedidosComercioPage } from "./Pages/Pedidos/PedidosComercioPage";
import { ComisionesComercioPage } from "./Pages/Comisiones/ComisionesComercioPage";
import { CitasComercioPage } from "./Pages/Citas/CitasComercioPage";

export default function AppUser() {
  const [user, setUser] = useState<JwtPayload | null>(null);
  useEffect(() => {
    const token = getLocalStorageJWTUsuario();
    console.log(token);

    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(decoded);
    }
  }, []);
  return (
    <Routes>
      <Route index element={<Navigate to="/usuario/login" replace />} />

      <Route
        path="/login"
        element={
          <PublicRouteUsuario>
            <LoginPage type="user" />
          </PublicRouteUsuario>
        }
      />
      <Route
        path="/crear-cuenta"
        element={
          <PublicRouteUsuario>
            <RegisterPage type="user" />
          </PublicRouteUsuario>
        }
      />

      <Route
        path="/recuperar-contrasena"
        element={
          <PublicRouteUsuario>
            <ForgotPasswordPage type="user" />
          </PublicRouteUsuario>
        }
      />

      <Route
        path="/restablecer-contrasena"
        element={
          <PublicRouteUsuario>
            <ResetPasswordPage />
          </PublicRouteUsuario>
        }
      />

      <Route
        path="/app"
        element={
          <PrivateRouteUsuario roles={["Comercio", "Colaborador"]}>
            <UserLayout />
          </PrivateRouteUsuario>
        }
      >
        <Route
          index
          element={
            user?.rol !== "Colaborador" ? (
              <PreviewPage user={user} />
            ) : (
              <PreviewNegocio />
            )
          }
        />
        <Route
          path="inicio"
          element={
            user?.rol !== "Colaborador" ? (
              <PreviewPage user={user} />
            ) : (
              <PreviewNegocio />
            )
          }
        />
        <Route path="comercio" element={<MiComercioPage user={user} />} />
        {user?.rol !== "Colaborador" ? (
          <>
            <Route
              path="comercio/editar/:id"
              element={<ComercioPageForm user={user} />}
            />
            <Route
              path="comercio/nuevo"
              element={<ComercioPageForm user={user} />}
            />
          </>
        ) : (
          <></>
        )}

        <Route path="perfil" element={<UserProfilePage />} />
        <Route
          path="perfil/cambiar-password"
          element={<UserChangePasswordForm />}
        />
        <Route
          path="productos-servicios"
          element={<ProductosServiciosPage />}
        />
        <Route
          path="configuracion-pagos"
          element={<ConfiguracionPagosPage />}
        />
        <Route path="pedidos" element={<PedidosComercioPage />} />
        <Route path="comisiones" element={<ComisionesComercioPage />} />
        <Route path="citas" element={<CitasComercioPage />} />
        {/* {user?.rol !== "Colaborador" ? (
          <>
            {" "}
            <Route path="plan" element={<PlanesPage user={user} />} />
          </>
        ) : (
          <></>
        )} */}

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
