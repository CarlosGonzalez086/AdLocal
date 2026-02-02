import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

import { adminRoutes } from "./adminRoutes";
import { userRoutes } from "./userRoutes";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLayout from "./components/layouts/AdminLayout";
import UserLayout from "./components/layouts/UserLayout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import WelcomeCollaboratorPage from "./pages/WelcomeCollaboratorPage";
import PlanesPublicList from "./pages/PlanesPublicList";

export default function App() {
  return (
    <BrowserRouter>
      {/* 🔔 TOASTER GLOBAL */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage type="user" />
            </PublicRoute>
          }
        />

        <Route
          path="/planes"
          element={
            <PublicRoute>
              <PlanesPublicList />
            </PublicRoute>
          }
        />

        <Route
          path="/recuperar-contrasena"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        <Route
          path="/cambiar-contrasena/:token"
          element={<ResetPasswordPage />}
        />

        <Route
          path="/nuevo-colaborador/:token"
          element={<WelcomeCollaboratorPage />}
        />

        <Route
          path="/login/admin"
          element={
            <PublicRoute>
              <LoginPage type="admin" />
            </PublicRoute>
          }
        />

        <Route
          path="/registro"
          element={
            <PublicRoute>
              <RegisterPage type="user" />
            </PublicRoute>
          }
        />

        <Route
          path="/crear-admin"
          element={
            <PublicRoute>
              <RegisterPage type="admin" />
            </PublicRoute>
          }
        />

        <Route
          path="/Admin"
          element={
            <PrivateRoute roles={["Admin"]}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {adminRoutes.filter(Boolean).map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        <Route
          path="/app"
          element={
            <PrivateRoute roles={["Comercio", "Colaborador"]}>
              <UserLayout />
            </PrivateRoute>
          }
        >
          {userRoutes.filter(Boolean).map((r: any) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

