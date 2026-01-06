import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import PaymentIcon from "@mui/icons-material/Payment";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import CreditCardIcon from "@mui/icons-material/CreditCard";

interface UserSidebarProps {
  drawerWidth: number;
}

const UserSidebar = ({ drawerWidth }: UserSidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { text: "Inicio", icon: <HomeIcon />, path: "/app" },
    { text: "Mi comercio", icon: <StoreIcon />, path: "/app/comercio" },
    { text: "Mi plan", icon: <PaymentIcon />, path: "/app/plan" },
    { text: "Pagos", icon: <HistoryIcon />, path: "/app/pagos" },
    { text: "Tarjetas", icon: <CreditCardIcon />, path: "/app/tarjetas" },
    {
      text: "Configuración",
      icon: <SettingsIcon />,
      path: "/app/configuracion",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 160,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          p: 1,
          backgroundColor: "#f5e9cf",
        }}
      >
        <Box
          component="img"
          src="https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg"
          alt="Logo AdLocal"
          sx={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Divider />

      <List sx={{ backgroundColor: "#f5e9cf", height: "100%" }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                sx={{
                  backgroundColor: isSelected ? "#D2B48C" : "transparent",
                  color: isSelected ? "#e8692c" : "inherit",
                  "&:hover": {
                    backgroundColor: isSelected ? "#D2B48C" : "#f5f5f5",
                  },
                }}
              >
                <ListItemIcon
                  sx={{ color: isSelected ? "#e8692c" : "inherit" }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default UserSidebar;
