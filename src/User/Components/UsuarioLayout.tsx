import { Box } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import UserHeader from "./UsuarioHeader";
import UserSidebar from "./UsuarioSidebar";

import styles from "../../styles/UserLayout.module.css";
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
    <Box className={styles.layout}>
      <Box component="a" href="#user-main-content" className={styles.skipLink}>
        Ir al contenido principal
      </Box>

      <UserHeader
        user={user}
        onMenuClick={handleOpenMobileMenu}
        onToggleCollapse={handleToggleCollapse}
        collapsed={collapsed}
        sidebarWidth={sidebarWidth}
      />

      <Box className={styles.contentRow}>
        <UserSidebar
          drawerWidth={DRAWER_WIDTH}
          collapsedWidth={COLLAPSED_WIDTH}
          mobileOpen={mobileOpen}
          onCloseMobile={handleCloseMobileMenu}
          collapsed={collapsed}
          user={user}
        />

        <Box
          id="user-main-content"
          component="main"
          tabIndex={-1}
          className={styles.mainContent}
        >
          <Box className={styles.outletContainer}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout;
