import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Box } from "@mui/material";

import AdminLogin from "./pages/AdminLogin";
import AdminCreate from "./pages/AdminCreate";
import DashboardHome from "./pages/DashboardHome";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import LayoutProtected from "./components/layouts/LayoutProtected";

export default function App() {
  return (
    <div style={{height:"100vh",width:"100vw"}}>
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

        <Route
          path="/"
          element={
            <PrivateRoute>
              <LayoutProtected>
                <DashboardHome />
              </LayoutProtected>
            </PrivateRoute>
          }
        />
        <Route
          path="/planes"
          element={
            <PrivateRoute>
              <LayoutProtected>
                <>Planes</>
              </LayoutProtected>
            </PrivateRoute>
          }
        />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <LayoutProtected>
                <>Usuarios</>
              </LayoutProtected>
            </PrivateRoute>
          }
        />
        <Route
          path="/configuraciones"
          element={
            <PrivateRoute>
              <LayoutProtected>
                <>Configuraciones</>
              </LayoutProtected>
            </PrivateRoute>
          }
        />
        <Route
          path="/historial-suscripciones"
          element={
            <PrivateRoute>
              <LayoutProtected>
                <>HistorialSuscripciones</>
              </LayoutProtected>
            </PrivateRoute>
          }
        />

        <Route path="/dashboard" element={<Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}
