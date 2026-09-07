import {
  AppBar,
  Avatar,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MaterialSymbol from "../../components/UI/MaterialSymbol/MaterialSymbol";
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
  "/usuario/app/inicio": "Inicio",
  "/usuario/app/comercio": "Mis comercios",
  "/usuario/app/comercio/nuevo": "Nuevo comercio",
  "/usuario/app/comercio/editar": "Editar comercio",
  "/usuario/app/plan": "Mi plan",
  "/usuario/app/pagos": "Pagos",
  "/usuario/app/configuracion": "Configuración",
  "/usuario/app/perfil": "Mi perfil",
  "/usuario/app/productos-servicios": "Productos y servicios",
  "/usuario/app/configuracion-pagos": "Configuración de pagos",
  "/usuario/app/pedidos": "Pedidos",
  "/usuario/app/citas": "Citas",
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
      className="user-header-appbar"
      style={headerVariables}
    >
      <Toolbar className="user-header-toolbar">
        <div className="user-header-left">
          <IconButton
            type="button"
            className="user-header-menu-btn"
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
            <h1
              className="user-header-title fz-h5 m-0"
              title={pageTitle}
            >
              {pageTitle}
            </h1>
          )}
        </div>

        {user && (
          <div className="user-header-user-section">
            <NotificacionesMenu />

            <Chip label={user.rol} size="small" className="user-header-role-chip" />

            <IconButton
              id="user-menu-button"
              type="button"
              className="user-header-avatar-btn"
              onClick={handleOpenMenu}
              aria-label="Abrir menú de usuario"
              aria-controls={menuOpen ? "user-account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={menuOpen ? "true" : undefined}
            >
              <Avatar
                src={user.nombre}
                alt={user.nombre ?? "Usuario"}
                className="user-header-avatar"
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
                  className: "user-header-menu-paper",
                },
              }}
            >
              <div className="user-header-menu-user-info">
                <Avatar alt="" className="user-header-menu-avatar">
                  {userInitial}
                </Avatar>

                <div className="user-header-menu-user-text">
                  <span className="user-header-menu-user-name">
                    {user.nombre || "Usuario"}
                  </span>

                  <span className="user-header-menu-user-role">
                    {user.rol}
                  </span>
                </div>
              </div>

              <Divider className="user-header-menu-divider" />

              <MenuItem
                className="user-header-menu-item"
                onClick={handleNavigateProfile}
              >
                <ListItemIcon className="user-header-menu-item-icon">
                  <MaterialSymbol icon="person" size="small" />
                </ListItemIcon>

                <span className="user-header-menu-item-text">
                  Mi perfil
                </span>
              </MenuItem>

              <Divider className="user-header-menu-divider" />

              <MenuItem
                className="user-header-menu-item user-header-logout-item"
                onClick={handleLogout}
              >
                <ListItemIcon className="user-header-menu-item-icon user-header-logout-icon">
                  <MaterialSymbol icon="logout" size="small" />
                </ListItemIcon>

                <span className="user-header-menu-item-text">
                  Cerrar sesión
                </span>
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;
