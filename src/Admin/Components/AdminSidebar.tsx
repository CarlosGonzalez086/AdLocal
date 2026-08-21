import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MaterialSymbol from "../../components/UI/MaterialSymbol/MaterialSymbol";
import styles from "../../styles/UserSidebar.module.css";
import type { CSSProperties } from "react";

interface SidebarProps {
  drawerWidth: number;
  collapsedWidth?: number;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface MenuItemConfig {
  text: string;
  icon: string;
  path: string;
}

type SidebarCssVariables = CSSProperties & {
  "--sidebar-width": string;
};

const LOGO_FULL =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

const LOGO_ICON =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

const AdminSidebar = ({
  drawerWidth,
  collapsedWidth = 76,
  collapsed,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isCollapsedDesktop = collapsed && !isMobile;

  const currentWidth = isMobile
    ? drawerWidth
    : collapsed
      ? collapsedWidth
      : drawerWidth;

  const sidebarVariables: SidebarCssVariables = {
    "--sidebar-width": `${currentWidth}px`,
  };

  const menuItems: MenuItemConfig[] = [
    {
      text: "Inicio",
      icon: "home",
      path: "/admin/app/inicio",
    },
    {
      text: "Planes",
      icon: "credit_card",
      path: "/admin/app/planes",
    },
    {
      text: "Usuarios",
      icon: "group",
      path: "/admin/app/usuarios",
    },
    {
      text: "Tipos comercios",
      icon: "storefront",
      path: "/admin/app/tipos-comercios",
    },
    {
      text: "Configuraciones",
      icon: "settings",
      path: "/admin/app/configuraciones",
    },
    {
      text: "Comisiones",
      icon: "paid",
      path: "/admin/app/comisiones",
    },
    {
      text: "Cuentas ADLocal",
      icon: "account_balance",
      path: "/admin/app/cuentas-adlocal",
    },
    {
      text: "Historial",
      icon: "history",
      path: "/admin/app/historial-suscripciones",
    },
  ];

  const normalizePath = (path: string) => {
    if (path === "/") {
      return path;
    }

    return path.replace(/\/+$/, "");
  };

  const isPathSelected = (currentPath: string, itemPath: string) => {
    const normalizedCurrentPath = normalizePath(currentPath);

    if (itemPath === "/app") {
      return normalizedCurrentPath === "/app";
    }

    return (
      normalizedCurrentPath === itemPath ||
      normalizedCurrentPath.startsWith(`${itemPath}/`)
    );
  };

  const drawerContent = (
    <Box className={styles.sidebarContent}>
      <Box
        className={[
          styles.logoSection,
          isCollapsedDesktop ? styles.logoSectionCollapsed : "",
          isMobile ? styles.logoSectionMobile : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Box
          component={Link}
          to="/admin/app/inicio"
          className={styles.logoLink}
          onClick={isMobile ? onCloseMobile : undefined}
        >
          <Box
            component="img"
            src={isCollapsedDesktop ? LOGO_ICON : LOGO_FULL}
            alt="ADLocal"
            className={[
              styles.logo,
              isCollapsedDesktop ? styles.logoCollapsed : "",
              isMobile ? styles.logoMobile : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </Box>
      </Box>

      <Divider className={styles.divider} />

      <Box component="nav" className={styles.navigation}>
        <List className={styles.menuList}>
          {menuItems.map((item) => {
            const selected = isPathSelected(location.pathname, item.path);

            const menuContent = (
              <ListItemButton
                component={Link}
                to={item.path}
                selected={selected}
                onClick={isMobile ? onCloseMobile : undefined}
                className={[
                  styles.menuButton,
                  selected ? styles.menuButtonSelected : "",
                  isCollapsedDesktop ? styles.menuButtonCollapsed : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <ListItemIcon
                  className={[
                    styles.menuIcon,
                    isCollapsedDesktop ? styles.menuIconCollapsed : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <MaterialSymbol
                    icon={item.icon}
                    size="medium"
                    filled={selected}
                  />
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  className={[
                    styles.menuText,
                    isCollapsedDesktop ? styles.menuTextCollapsed : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  slotProps={{
                    primary: {
                      component: "span",
                      noWrap: true,
                      className: styles.menuTextTypography,
                    },
                  }}
                />
              </ListItemButton>
            );

            return (
              <ListItem
                key={item.path}
                disablePadding
                className={styles.menuListItem}
              >
                {isCollapsedDesktop ? (
                  <Tooltip
                    title={item.text}
                    placement="right"
                    arrow
                    slotProps={{
                      tooltip: {
                        className: styles.menuTooltip,
                      },
                      arrow: {
                        className: styles.menuTooltipArrow,
                      },
                    }}
                  >
                    {menuContent}
                  </Tooltip>
                ) : (
                  menuContent
                )}
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onCloseMobile}
      style={sidebarVariables}
      className={[
        styles.drawer,
        isMobile ? styles.mobileDrawer : styles.desktopDrawer,
      ].join(" ")}
      slotProps={{
        paper: {
          className: styles.drawerPaper,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AdminSidebar;
