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
import { useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MaterialSymbol from "../../components/UI/MaterialSymbol/MaterialSymbol";
import styles from "../../styles/UserHeader.module.css";
import { clearStorageUsuario } from "../../utils/storageUsuario";
import type { JwtPayload } from "../Auth/PrivateRouteUsuario";
import NotificacionesMenu from "./NotificacionesMenu";

interface UserHeaderProps {
  user: JwtPayload | null;
  onMenuClick: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
  sidebarWidth: number;
}

type HeaderCssVariables = CSSProperties & {
  "--sidebar-width": string;
};

const menuTitles: Record<string, string> = {
  "/usuario/app": "Inicio",
  "/usuario/app/comercio": "Mis comercios",
  "/usuario/app/comercio/nuevo": "Nuevo comercio",
  "/usuario/app/comercio/editar": "Editar comercio",
  "/usuario/app/plan": "Mi plan",
  "/usuario/app/pagos": "Pagos",
  "/usuario/app/configuracion": "Configuración",
  "/usuario/app/perfil": "Mi perfil",
  "/usuario/app/productos-servicios": "Productos y servicios",
  "/usuario/app/configuracion-pagos": "Configuracion de pagos",
  "/usuario/app/pedidos": "Pedidos",
  "/usuario/app/comisiones": "Comisiones",
  "/usuario/app/productos-servicios/comercios":
    "Productos y servicios de los comercios",
  "/usuario/app/productos-servicios/comercios/comercio":
    "Productos y servicios del comercio",
  "/usuario/app/tarjetas": "Tarjetas",
  "/usuario/app/vistaprevia": "Vista previa",
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
  const menuOpen = Boolean(anchorEl);
  const pageTitle = useMemo(
    () => getPageTitle(location.pathname),
    [location.pathname],
  );

  const userInitial = user?.nombre?.trim().charAt(0).toUpperCase() || "U";

  const headerVariables: HeaderCssVariables = {
    "--sidebar-width": `${sidebarWidth}px`,
  };

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
    navigate("/usuario/app/perfil");
  };

  const handleLogout = () => {
    handleCloseMenu();

    clearStorageUsuario();

    navigate("/usuario/login", {
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
            <NotificacionesMenu />

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
                src={user.nombre}
                alt={user.nombre ?? "Usuario"}
                className={styles.avatar}
              >
                {userInitial}
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
                <Avatar alt="" className={styles.menuAvatar}>
                  {userInitial}
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
