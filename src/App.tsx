import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import PageLoader from "./components/UI/PageLoader";
import AdLocalErrorBoundary from "./components/UI/AdLocalErrorBoundary";
import { PwaInstallBanner } from "./components/PWA/PwaInstallBanner";

const AppUser = lazy(() => import("./User/AppUser"));
const AppAdmin = lazy(() => import("./Admin/AppAdmin"));

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />

      <PwaInstallBanner />

      <AdLocalErrorBoundary fullScreen sectionName="la aplicación">
        <Suspense fallback={<PageLoader fullScreen message="Iniciando ADLocal..." />}>
          <Routes>
            <Route path="/" element={<Navigate to="/usuario/login" replace />} />
            <Route path="/usuario/*" element={<AppUser />} />
            <Route path="/admin/*" element={<AppAdmin />} />
            <Route path="*" element={<Navigate to="/usuario/login" replace />} />
          </Routes>
        </Suspense>
      </AdLocalErrorBoundary>
    </BrowserRouter>
  );
}
