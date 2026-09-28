import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import UserHeader from "./UsuarioHeader";
import UserSidebar from "./UsuarioSidebar";

import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../Auth/PrivateRouteUsuario";
import { getLocalStorageJWTUsuario } from "../../utils/storageUsuario";
import AdLocalErrorBoundary from "../../components/UI/AdLocalErrorBoundary";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 76;

const UserLayout = () => {
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
    const updateUserFromStorage = () => {
      const token = getLocalStorageJWTUsuario();
      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          setUser(decoded);
        } catch {
          setUser(null);
        }
      }
    };

    updateUserFromStorage();

    const handleTokenRefreshed = (e: Event) => {
      const customEvent = e as CustomEvent<{ token?: string; userType?: string }>;
      if (customEvent.detail?.userType === "usuario" && customEvent.detail?.token) {
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

      <UserHeader
        user={user}
        onMenuClick={handleOpenMobileMenu}
        onToggleCollapse={handleToggleCollapse}
        collapsed={collapsed}
        sidebarWidth={sidebarWidth}
      />

      <div className="user-layout-content-row">
        <UserSidebar
          drawerWidth={DRAWER_WIDTH}
          collapsedWidth={COLLAPSED_WIDTH}
          mobileOpen={mobileOpen}
          onCloseMobile={handleCloseMobileMenu}
          collapsed={collapsed}
          user={user}
        />

        <main
          id="user-main-content"
          tabIndex={-1}
          className="user-layout-main-content"
        >
          <div className="user-layout-outlet-container">
            <AdLocalErrorBoundary sectionName="el módulo de usuario">
              <Outlet />
            </AdLocalErrorBoundary>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

