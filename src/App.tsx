import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

export default function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <BrowserRouter>
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
              <PrivateRoute role="Admin">
                <AdminLayout />
              </PrivateRoute>
            }
          >
            {adminRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>

          <Route
            path="/app"
            element={
              <PrivateRoute role="Comercio">
                <UserLayout />
              </PrivateRoute>
            }
          >
            {userRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
