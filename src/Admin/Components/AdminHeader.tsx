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
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import MaterialSymbol from "../../components/UI/MaterialSymbol/MaterialSymbol";
import { clearStorageAdmin } from "../../utils/storageAdmin";
import type { JwtPayload } from "../Auth/PrivateRouteAdmin";

interface AdminHeaderProps {
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
  "/admin/app": "Inicio",
  "/admin/app/planes": "Planes",
  "/admin/app/usuarios": "Usuarios",
  "/admin/app/tipos-comercios": "Tipos Comercios",
  "/admin/app/configuraciones": "Configuraciones",
  "/admin/app/perfil": "Mi perfil",
  "/admin/app/perfil/cambiar-contrasena": "Cambiar contraseña",
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

const AdminHeader = ({
  user,
  onMenuClick,
  onToggleCollapse,
  collapsed,
  sidebarWidth,
}: AdminHeaderProps) => {
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
    navigate("/admin/app/perfil");
  };

  const handleLogout = () => {
    handleCloseMenu();

    clearStorageAdmin();

    navigate("/admin/login", {
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
            <Typography
              component="h1"
              className="user-header-title"
              title={pageTitle}
            >
              {pageTitle}
            </Typography>
          )}
        </div>

        {user && (
          <div className="user-header-user-section">
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
              <Avatar alt={user.nombre ?? "Usuario"} className="user-header-avatar">
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
                  <Typography component="span" className="user-header-menu-user-name">
                    {user.nombre || "Usuario"}
                  </Typography>

                  <Typography component="span" className="user-header-menu-user-role">
                    {user.rol}
                  </Typography>
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

                <Typography component="span" className="user-header-menu-item-text">
                  Mi perfil
                </Typography>
              </MenuItem>

              <Divider className="user-header-menu-divider" />

              <MenuItem
                className="user-header-menu-item user-header-logout-item"
                onClick={handleLogout}
              >
                <ListItemIcon className="user-header-menu-item-icon user-header-logout-icon">
                  <MaterialSymbol icon="logout" size="small" />
                </ListItemIcon>

                <Typography component="span" className="user-header-menu-item-text">
                  Cerrar sesión
                </Typography>
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;

