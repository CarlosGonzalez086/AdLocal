import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../../context/UserContext ";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

interface HeaderProps {
  user: User | null;
  onMenuClick: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}

const Header = ({
  user,
  onMenuClick,
  onToggleCollapse,
  collapsed,
}: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);

  const showImage = !!user?.FotoUrl && !imgError;

  const menuTitles: Record<string, string> = {
    "/Admin": "Inicio",
    "/Admin/planes": "Planes",
    "/Admin/usuarios": "Usuarios",
    "/Admin/configuraciones": "Configuraciones",
    "/Admin/historial-suscripciones": "Historial",
    "/Admin/perfil": "Mi perfil",
    "/Admin/perfil/cambiar-password": "Cambiar contraseña",
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    navigate("/Admin/perfil");
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getInitials = (nombre?: string) => {
    if (!nombre) return "";
    const words = nombre.trim().split(" ");
    return words.length === 1
      ? words[0][0].toUpperCase()
      : words[0][0].toUpperCase() + words[1][0].toUpperCase();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(14px)",
        background: "rgba(245,233,207,0.85)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        color: "#3A2419",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 64,
          px: { xs: 1.5, md: 2.5 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* ===== LEFT ===== */}
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={isMobile ? onMenuClick : onToggleCollapse}
            sx={{
              bgcolor: "rgba(0,0,0,0.05)",
              "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
              borderRadius: 2,
            }}
          >
            {isMobile ? (
              <MenuIcon />
            ) : collapsed ? (
              <MenuIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>

          <Typography
            fontWeight={700}
            sx={{
              fontSize: { xs: "1rem", md: "1.15rem" },
              color: "#008989",
              whiteSpace: "nowrap",
            }}
          >
            {menuTitles[location.pathname] ?? ""}
          </Typography>
        </Box>

        {/* ===== RIGHT ===== */}
        {user && (
          <Box>
            <IconButton onClick={handleMenuOpen}>
              <Avatar
                src={showImage ? user.FotoUrl : undefined}
                onError={() => setImgError(true)}
                sx={{
                  width: 36,
                  height: 36,
                  fontWeight: 600,
                  bgcolor: "#e8692c",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {!showImage && getInitials(user.nombre)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  mt: 1,
                  minWidth: 180,
                  boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
                },
              }}
            >
              <MenuItem onClick={handleProfile} sx={{ fontWeight: 500 }}>
                Mi perfil
              </MenuItem>

              <Divider />

              <MenuItem
                onClick={handleLogout}
                sx={{ color: "error.main", fontWeight: 500 }}
              >
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
