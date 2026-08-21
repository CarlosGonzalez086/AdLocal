import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import MaterialSymbol from "../../components/UI/MaterialSymbol/MaterialSymbol";
import styles from "../../styles/UserSidebar.module.css";
import type { JwtPayload } from "../Auth/PrivateRouteUsuario";

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

const LOGO_FULL =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

const LOGO_ICON =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

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

    // if (!isCollaborator) {
    //   items.push(
    //     {
    //       text: "Mi plan",
    //       icon: "event_note",
    //       path: "/usuario/app/plan",
    //     },
    //     {
    //       text: "Tarjetas",
    //       icon: "credit_card",
    //       path: "/usuario/app/tarjetas",
    //     },
    //   );
    // }

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
          to="/usuario/app/inicio"
          className={styles.logoLink}
          aria-label="Ir al inicio de ADLocal"
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

        {isMobile && (
          <Typography component="span" className={styles.mobileAppName}>
            ADLocal
          </Typography>
        )}
      </Box>

      <Divider className={styles.divider} />

      <Box
        component="nav"
        className={styles.navigation}
        aria-label="Navegación principal"
      >
        <List className={styles.menuList}>
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
                  primary={item.text}
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

      {!isCollapsedDesktop && planPresentation && (
        <Box className={styles.planContainer}>
          <Box className={styles.planCard}>
            <Box className={styles.planIcon}>
              <MaterialSymbol
                icon={planPresentation.icon}
                size="medium"
                filled
              />
            </Box>

            <Box className={styles.planInformation}>
              <Typography component="span" className={styles.planCaption}>
                Plan actual
              </Typography>

              <Typography component="span" className={styles.planName}>
                {planPresentation.label}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
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

export default UserSidebar;
