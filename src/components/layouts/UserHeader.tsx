import {
  AppBar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../../context/UserContext ";

interface UserHeaderProps {
  user: User | null;
}

const UserHeader = ({ user }: UserHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleError = () => setImgError(true);

  const showImage = !!user?.FotoUrl && !imgError;

  const menuTitles: Record<string, string> = {
    "/app": "Inicio",
    "/app/comercio": "Mi comercio",
    "/app/plan": "Mi plan",
    "/app/pagos": "Pagos",
    "/app/configuracion": "Configuración",
    "/app/perfil": "Mi perfil",
  };

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    navigate("/app/perfil");
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

  console.log(user);

  return (
    <AppBar position="static" sx={{ backgroundColor: "#f5e9cf" }} elevation={0}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#008989" }}
        >
          {menuTitles[location.pathname] ?? ""}
        </Typography>

        {user && (
          <Box>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar
                src={showImage ? user.FotoUrl : undefined}
                onError={handleError} // Si falla, activamos imgError
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
            >
              <MenuItem onClick={handleProfile}>Mi perfil</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;
