import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import MaterialSymbol from "../../components/UI/MaterialSymbol/MaterialSymbol";
import type { JwtPayload } from "../Auth/PrivateRouteUsuario";
import { ADLOCAL_MARK_URL } from "../../constants/brand";

interface UserSidebarProps {
  drawerWidth: number;
  collapsedWidth?: number;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  user: JwtPayload | null;
}

interface MenuItemConfig {
  text: string;
  icon: string;
  path: string;
}

interface PlanPresentation {
  icon: string;
  label: string;
}

type SidebarCssVariables = CSSProperties & {
  "--sidebar-width": string;
};

const PLAN_PRESENTATION: Record<string, PlanPresentation> = {
  FREE: {
    icon: "redeem",
    label: "Free",
  },
  BASIC: {
    icon: "bolt",
    label: "Basic",
  },
  PRO: {
    icon: "rocket_launch",
    label: "Pro",
  },
  BUSINESS: {
    icon: "business_center",
    label: "Business",
  },
};

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

const UserSidebar = ({
  drawerWidth,
  collapsedWidth = 76,
  collapsed,
  mobileOpen,
  onCloseMobile,
  user,
}: UserSidebarProps) => {
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

  const rol = user?.rol;
  const planTipo = user?.planTipo;

  const menuItems = useMemo<MenuItemConfig[]>(() => {
    const items: MenuItemConfig[] = [
      {
        text: "Inicio",
        icon: "home",
        path: "/usuario/app/inicio",
      },
      {
        text: "Mi comercio",
        icon: "storefront",
        path: "/usuario/app/comercio",
      },
      {
        text: "Pedidos",
        icon: "receipt_long",
        path: "/usuario/app/pedidos",
      },
      {
        text: "Citas",
        icon: "calendar_month",
        path: "/usuario/app/citas",
      },
    ];

    const isCollaborator = rol === "Colaborador";

    if (!isCollaborator) {
      items.push({
        text: "Comisiones",
        icon: "account_balance_wallet",
        path: "/usuario/app/comisiones",
      });
    }

    const hasMultipleBusinesses =
      rol === "Comercio" && (planTipo === "PRO" || planTipo === "BUSINESS");

    const hasSingleBusiness =
      isCollaborator ||
      (rol === "Comercio" && (planTipo === "BASIC" || planTipo === "FREE"));

    if (hasMultipleBusinesses) {
      items.push({
        text: "Productos y servicios",
        icon: "category",
        path: "/usuario/app/productos-servicios/comercios",
      });
    }

    if (hasSingleBusiness) {
      items.push({
        text: "Productos y servicios",
        icon: "category",
        path: "/usuario/app/productos-servicios",
      });
    }
    if (hasSingleBusiness) {
      items.push({
        text: "Configuracion de pagos",
        icon: "payments",
        path: "/usuario/app/configuracion-pagos",
      });
    }

    return items;
  }, [rol, planTipo]);

  const planPresentation = user?.planTipo
    ? (PLAN_PRESENTATION[user.planTipo.toUpperCase()] ?? {
        icon: "workspace_premium",
        label: user.planTipo,
      })
    : null;

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
          to="/usuario/app/inicio"
          className="user-sidebar-logo-link"
          aria-label="Ir al inicio de ADLocal"
          onClick={isMobile ? onCloseMobile : undefined}
        >
          <img
            src={ADLOCAL_MARK_URL}
            alt=""
            className={[
              "user-sidebar-logo-img",
              isCollapsedDesktop ? "user-sidebar-logo-img-collapsed" : "",
              isMobile ? "user-sidebar-logo-img-mobile" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
          {!isCollapsedDesktop && (
            <span className="user-sidebar-brand-wordmark" aria-hidden="true">
              <span>AD</span><span>Local</span>
            </span>
          )}
        </Link>
      </div>

      <Divider className="user-sidebar-divider" />

      <nav
        className="user-sidebar-nav"
        aria-label="Navegación principal"
      >
        <List className="user-sidebar-menu-list">
          {menuItems.map((item) => {
            const selected = isPathSelected(location.pathname, item.path);

            const menuContent = (
              <ListItemButton
                component={Link}
                to={item.path}
                selected={selected}
                aria-current={selected ? "page" : undefined}
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
                  primary={item.text}
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

      {!isCollapsedDesktop && planPresentation && (
        <div className="user-sidebar-plan-container">
          <div className="user-sidebar-plan-card">
            <div className="user-sidebar-plan-icon">
              <MaterialSymbol
                icon={planPresentation.icon}
                size="medium"
                filled
              />
            </div>

            <div className="user-sidebar-plan-info">
              <span className="user-sidebar-plan-caption">
                Plan actual
              </span>

              <span className="user-sidebar-plan-name">
                {planPresentation.label}
              </span>
            </div>
          </div>
        </div>
      )}
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

export default UserSidebar;

