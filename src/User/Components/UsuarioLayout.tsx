import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import UserHeader from "./UsuarioHeader";
import UserSidebar from "./UsuarioSidebar";

import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../Auth/PrivateRouteUsuario";
import { getLocalStorageJWTUsuario } from "../../utils/storageUsuario";

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
    const token = getLocalStorageJWTUsuario();
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(decoded);
    }
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
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;

