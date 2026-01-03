import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { User } from "../../context/UserContext ";
import { useLocation, useNavigate } from "react-router-dom";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const menuItems = [
    { text: "Home", path: "/Admin" },
    { text: "Planes", path: "/Admin/planes" },
    { text: "Usuarios", path: "/Admin/usuarios" },
    {
      text: "Configuraciones",

      path: "/Admin/configuraciones",
    },
    {
      text: "Historial de suscripciones",

      path: "/Admin/historial-suscripciones",
    },
    {
      text: "Perfil",

      path: "/Admin/perfil",
    },
    {
      text: "Cambiar contraseña",

      path: "/Admin/perfil/cambiar-password",
    },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
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
  const getInitials = (nombre: string) => {
    if (!nombre) return "";

    const words = nombre.trim().split(" ");

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return words[0][0].toUpperCase() + words[1][0].toUpperCase();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#f5e9cf" }} elevation={0}>
      <Toolbar>
        <Typography
          className="fw-bold"
          variant="h6"
          sx={{ flexGrow: 1, color: "#008989" }}
        >
          {menuItems.find((item) => item.path === location.pathname)?.text}
        </Typography>

        {user && (
          <Box>
            <IconButton onClick={handleMenuOpen} size="small">
              <Avatar>{getInitials(user.nombre)}</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleProfile}>Ver mi perfil</MenuItem>
              <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
