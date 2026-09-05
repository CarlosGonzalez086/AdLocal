import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MaterialSymbol from "../../components/UI/MaterialSymbol/MaterialSymbol";
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

const LOGO_FULL = "/logo-adlocal.png";

const LOGO_ICON = "/logo-adlocal.png";

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
    <div className="user-sidebar-content">
      <div
        className={[
          "user-sidebar-logo-section",
          isCollapsedDesktop ? "user-sidebar-logo-collapsed" : "",
          isMobile ? "user-sidebar-logo-mobile" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Link
          to="/admin/app/inicio"
          className="user-sidebar-logo-link"
          onClick={isMobile ? onCloseMobile : undefined}
        >
          <img
            src={isCollapsedDesktop ? LOGO_ICON : LOGO_FULL}
            alt="ADLocal"
            className={[
              "user-sidebar-logo-img",
              isCollapsedDesktop ? "user-sidebar-logo-img-collapsed" : "",
              isMobile ? "user-sidebar-logo-img-mobile" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </Link>
      </div>

      <Divider className="user-sidebar-divider" />

      <nav className="user-sidebar-nav">
        <List className="user-sidebar-menu-list">
          {menuItems.map((item) => {
            const selected = isPathSelected(location.pathname, item.path);

            const menuContent = (
              <ListItemButton
                component={Link}
                to={item.path}
                selected={selected}
                onClick={isMobile ? onCloseMobile : undefined}
                className={[
                  "user-sidebar-menu-btn",
                  selected ? "user-sidebar-menu-btn--selected" : "",
                  isCollapsedDesktop ? "user-sidebar-menu-btn--collapsed" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <ListItemIcon
                  className={[
                    "user-sidebar-menu-icon",
                    isCollapsedDesktop ? "user-sidebar-menu-icon--collapsed" : "",
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
                    "user-sidebar-menu-text",
                    isCollapsedDesktop ? "user-sidebar-menu-text--collapsed" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  slotProps={{
                    primary: {
                      component: "span",
                      noWrap: true,
                      className: "user-sidebar-menu-text-typo",
                    },
                  }}
                />
              </ListItemButton>
            );

            return (
              <ListItem
                key={item.path}
                disablePadding
                className="user-sidebar-menu-item"
              >
                {isCollapsedDesktop ? (
                  <Tooltip
                    title={item.text}
                    placement="right"
                    arrow
                    slotProps={{
                      tooltip: {
                        className: "user-sidebar-tooltip",
                      },
                      arrow: {
                        className: "user-sidebar-tooltip-arrow",
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
      </nav>
    </div>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onCloseMobile}
      style={sidebarVariables}
      className={[
        "user-sidebar-drawer",
        isMobile ? "user-sidebar-mobile-drawer" : "user-sidebar-desktop-drawer",
      ].join(" ")}
      slotProps={{
        paper: {
          className: "user-sidebar-paper",
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default AdminSidebar;

