import { Box } from "@mui/material";
import {
  useCallback,
  useContext,
  useState,
} from "react";
import { Outlet } from "react-router-dom";


import UserHeader from "./UserHeader";
import UserSidebar from "./UserSidebar";

import "../../styles/styles.css";
import styles from "../../styles/UserLayout.module.css";
import { UserContext } from "../../context/UserContext ";

const DRAWER_WIDTH = 240;
const COLLAPSED_WIDTH = 76;

const UserLayout = () => {
  const user = useContext(UserContext);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [collapsed, setCollapsed] =
    useState(false);

  const sidebarWidth = collapsed
    ? COLLAPSED_WIDTH
    : DRAWER_WIDTH;

  const handleOpenMobileMenu =
    useCallback(() => {
      setMobileOpen(true);
    }, []);

  const handleCloseMobileMenu =
    useCallback(() => {
      setMobileOpen(false);
    }, []);

  const handleToggleCollapse =
    useCallback(() => {
      setCollapsed(
        (currentValue) => !currentValue,
      );
    }, []);

  return (
    <Box className={styles.layout}>
      <Box
        component="a"
        href="#user-main-content"
        className={styles.skipLink}
      >
        Ir al contenido principal
      </Box>

      <UserHeader
        user={user}
        onMenuClick={handleOpenMobileMenu}
        onToggleCollapse={
          handleToggleCollapse
        }
        collapsed={collapsed}
        sidebarWidth={sidebarWidth}
      />

      <Box className={styles.contentRow}>
        <UserSidebar
          drawerWidth={DRAWER_WIDTH}
          collapsedWidth={COLLAPSED_WIDTH}
          mobileOpen={mobileOpen}
          onCloseMobile={
            handleCloseMobileMenu
          }
          collapsed={collapsed}
        />

        <Box
          id="user-main-content"
          component="main"
          tabIndex={-1}
          className={styles.mainContent}
        >
          <Box
            className={styles.outletContainer}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserLayout;