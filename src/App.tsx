import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminLogin from "./pages/AdminLogin";
import AdminCreate from "./pages/AdminCreate";
import PublicRoute from "./routes/PublicRoute";
import ProtectedLayout from "./components/layouts/ProtectedLayout";
import { protectedRoutes } from "./routesConfig";

export default function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/crear-admin"
            element={
              <PublicRoute>
                <AdminCreate />
              </PublicRoute>
            }
          />

          <Route element={<ProtectedLayout />}>
            {protectedRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
