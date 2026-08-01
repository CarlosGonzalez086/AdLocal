import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";


import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import styles from "../../styles//UserHeader.module.css";
import type { User } from "../../context/UserContext ";

interface UserHeaderProps {
  user: User | null;
  onMenuClick: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
  sidebarWidth: number;
}

type HeaderCssVariables = CSSProperties & {
  "--sidebar-width": string;
};

const menuTitles: Record<string, string> = {
  "/app": "Inicio",
  "/app/comercio": "Mis comercios",
  "/app/comercio/nuevo": "Nuevo comercio",
  "/app/comercio/editar": "Editar comercio",
  "/app/plan": "Mi plan",
  "/app/pagos": "Pagos",
  "/app/configuracion": "Configuración",
  "/app/perfil": "Mi perfil",
  "/app/productos-servicios": "Productos y servicios",
  "/app/productos-servicios/comercios":
    "Productos y servicios de los comercios",
  "/app/productos-servicios/comercios/comercio":
    "Productos y servicios del comercio",
  "/app/tarjetas": "Tarjetas",
  "/app/vistaprevia": "Vista previa",
};

const normalizePathname = (pathname: string): string => {
  if (pathname === "/") {
    return pathname;
  }

  return pathname.replace(/\/+$/, "");
};

const getPageTitle = (pathname: string): string => {
  const normalizedPath = normalizePathname(pathname);

  const exactTitle = menuTitles[normalizedPath];

  if (exactTitle) {
    return exactTitle;
  }

  /*
   * Permite reconocer rutas dinámicas como:
   *
   * /app/comercio/editar/15
   * /app/vistaprevia/20
   * /app/productos-servicios/comercios/comercio/5
   */
  const matchedRoute = Object.entries(menuTitles)
    .sort(([firstPath], [secondPath]) => secondPath.length - firstPath.length)
    .find(([route]) => normalizedPath.startsWith(`${route}/`));

  return matchedRoute?.[1] ?? "Panel";
};

const UserHeader = ({
  user,
  onMenuClick,
  onToggleCollapse,
  collapsed,
  sidebarWidth,
}: UserHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const [imgError, setImgError] = useState(false);

  const menuOpen = Boolean(anchorEl);

  const showImage = Boolean(user?.FotoUrl) && !imgError;

  const pageTitle = useMemo(
    () => getPageTitle(location.pathname),
    [location.pathname],
  );

  const userInitial = user?.nombre?.trim().charAt(0).toUpperCase() || "U";

  const headerVariables: HeaderCssVariables = {
    "--sidebar-width": `${sidebarWidth}px`,
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImgError(false);
  }, [user?.FotoUrl]);

  const handleToggleSidebar = () => {
    if (isMobile) {
      onMenuClick();
      return;
    }

    onToggleCollapse();
  };

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleNavigateProfile = () => {
    handleCloseMenu();
    navigate("/app/perfil");
  };

  const handleLogout = () => {
    handleCloseMenu();

    localStorage.removeItem("token");

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      className={styles.appBar}
      style={headerVariables}
    >
      <Toolbar className={styles.toolbar}>
        <Box className={styles.leftSection}>
          <IconButton
            type="button"
            className={styles.menuButton}
            onClick={handleToggleSidebar}
            aria-label={
              isMobile
                ? "Abrir menú de navegación"
                : collapsed
                  ? "Expandir menú lateral"
                  : "Contraer menú lateral"
            }
          >
            <MaterialSymbol
              icon={isMobile || collapsed ? "menu" : "chevron_left"}
              size="medium"
            />
          </IconButton>

          {pageTitle && (
            <Typography
              component="h1"
              className={styles.pageTitle}
              title={pageTitle}
            >
              {pageTitle}
            </Typography>
          )}
        </Box>

        {user && (
          <Box className={styles.userSection}>
            <Chip label={user.rol} size="small" className={styles.roleChip} />

            <IconButton
              id="user-menu-button"
              type="button"
              className={styles.avatarButton}
              onClick={handleOpenMenu}
              aria-label="Abrir menú de usuario"
              aria-controls={menuOpen ? "user-account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
            >
              <Avatar
                src={showImage ? user.FotoUrl : undefined}
                alt={user.nombre ?? "Usuario"}
                className={styles.avatar}
                slotProps={{
                  img: {
                    onError: () => setImgError(true),
                    referrerPolicy: "no-referrer",
                  },
                }}
              >
                {!showImage && userInitial}
              </Avatar>
            </IconButton>

            <Menu
              id="user-account-menu"
              anchorEl={anchorEl}
              open={menuOpen}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              slotProps={{
                paper: {
                  className: styles.menuPaper,
                },
              }}
            >
              <Box className={styles.userInformation}>
                <Avatar
                  src={showImage ? user.FotoUrl : undefined}
                  alt=""
                  className={styles.menuAvatar}
                  slotProps={{
                    img: {
                      onError: () => setImgError(true),
                      referrerPolicy: "no-referrer",
                    },
                  }}
                >
                  {!showImage && userInitial}
                </Avatar>

                <Box className={styles.userInformationText}>
                  <Typography component="span" className={styles.userName}>
                    {user.nombre || "Usuario"}
                  </Typography>

                  <Typography component="span" className={styles.userRole}>
                    {user.rol}
                  </Typography>
                </Box>
              </Box>

              <Divider className={styles.menuDivider} />

              <MenuItem
                className={styles.menuItem}
                onClick={handleNavigateProfile}
              >
                <ListItemIcon className={styles.menuItemIcon}>
                  <MaterialSymbol icon="person" size="small" />
                </ListItemIcon>

                <Typography component="span" className={styles.menuItemText}>
                  Mi perfil
                </Typography>
              </MenuItem>

              <Divider className={styles.menuDivider} />

              <MenuItem
                className={[styles.menuItem, styles.logoutMenuItem].join(" ")}
                onClick={handleLogout}
              >
                <ListItemIcon
                  className={[styles.menuItemIcon, styles.logoutIcon].join(" ")}
                >
                  <MaterialSymbol icon="logout" size="small" />
                </ListItemIcon>

                <Typography component="span" className={styles.menuItemText}>
                  Cerrar sesión
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;
