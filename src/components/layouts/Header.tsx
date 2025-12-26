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
import type { User } from "../../context/UserContext ";
import { useLocation } from "react-router-dom";

interface HeaderProps {
  user: User | null;
}

const Header = ({ user }: HeaderProps) => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuItems = [
    { text: "Home", path: "/" },
    { text: "Planes", path: "/planes" },
    { text: "Usuarios", path: "/usuarios" },
    {
      text: "Configuraciones",

      path: "/configuraciones",
    },
    {
      text: "Historial de suscripciones",

      path: "/historial-suscripciones",
    },
  ];

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    console.log("Ver perfil");
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("token");
    window.location.href = "/login";
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
              <Avatar src={user.nombre}>{user.nombre}</Avatar>
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
