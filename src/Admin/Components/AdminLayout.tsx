import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

import { jwtDecode } from "jwt-decode";
import { getLocalStorageJWTAdmin } from "../../utils/storageAdmin";
import type { JwtPayload } from "../Auth/PrivateRouteAdmin";
import AdLocalErrorBoundary from "../../components/UI/AdLocalErrorBoundary";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 76;

const AdminLayout = () => {
  const [user, setUser] = useState<JwtPayload | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? COLLAPSED_WIDTH : DRAWER_WIDTH;

  const handleOpenMobileMenu = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileOpen(false);
  }, []);

  const handleToggleCollapse = useCallback(() => {
    setCollapsed((currentValue) => !currentValue);
  }, []);

  useEffect(() => {
    const updateAdminFromStorage = () => {
      const token = getLocalStorageJWTAdmin();
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          setUser(decoded);
        } catch {
          setUser(null);
        }
      }
    };

    updateAdminFromStorage();

    const handleTokenRefreshed = (e: Event) => {
      const customEvent = e as CustomEvent<{ token?: string; userType?: string }>;
      if (customEvent.detail?.userType === "admin" && customEvent.detail?.token) {
        try {
          const decoded = jwtDecode<JwtPayload>(customEvent.detail.token);
          setUser(decoded);
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener("adlocal_token_refreshed", handleTokenRefreshed);
    return () => {
      window.removeEventListener("adlocal_token_refreshed", handleTokenRefreshed);
    };
  }, []);

  return (
    <div className="user-layout">
      <a href="#user-main-content" className="user-layout-skip-link">
        Ir al contenido principal
      </a>

      <AdminHeader
        user={user}
        onMenuClick={handleOpenMobileMenu}
        onToggleCollapse={handleToggleCollapse}
        collapsed={collapsed}
        sidebarWidth={sidebarWidth}
      />

      <div className="user-layout-content-row">
        <AdminSidebar
          drawerWidth={DRAWER_WIDTH}
          collapsedWidth={COLLAPSED_WIDTH}
          mobileOpen={mobileOpen}
          onCloseMobile={handleCloseMobileMenu}
          collapsed={collapsed}
        />

        <main
          id="user-main-content"
          tabIndex={-1}
          className="user-layout-main-content"
        >
          <div className="user-layout-outlet-container">
            <AdLocalErrorBoundary sectionName="el módulo administrativo">
              <Outlet />
            </AdLocalErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

