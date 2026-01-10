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
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CategoryIcon from "@mui/icons-material/Category";

interface UserSidebarProps {
  drawerWidth: number;
  collapsedWidth?: number;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const UserSidebar = ({
  drawerWidth,
  collapsedWidth = 72,
  collapsed,
  mobileOpen,
  onCloseMobile,
}: UserSidebarProps) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const menuItems = [
    { text: "Inicio", icon: <HomeIcon />, path: "/app" },
    { text: "Mi comercio", icon: <StoreIcon />, path: "/app/comercio" },
    { text: "Mi plan", icon: <EventNoteIcon />, path: "/app/plan" },
    // { text: "Pagos", icon: <AttachMoneyIcon />, path: "/app/pagos" },
    { text: "Tarjetas", icon: <CreditCardIcon />, path: "/app/tarjetas" },
    {
      text: "Productos y Servicios",
      icon: <CategoryIcon />,
      path: "/app/productos-servicios",
    },
    // {
    //   text: "Configuración",
    //   icon: <SettingsIcon />,
    //   path: "/app/configuracion",
    // },
  ];

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onCloseMobile}
      sx={{
        width: currentWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: currentWidth,
          boxSizing: "border-box",
          transition: "width 0.3s",
        },
      }}
    >
      <Box
        sx={{
          height: 160,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          px: 2,
          backgroundColor: "#f5e9cf",
        }}
      >
        {!collapsed ? (
          <Box
            component="img"
            src="https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg"
            alt="Logo AdLocal"
            sx={{ width: "100%", maxHeight: 120, objectFit: "cover" }}
          />
        ) : (
          <Box
            component="img"
            src="https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/AZuAXHqalTLlz8th7NMdBA-AZuAXHqaHD92HliWBxJzdA.jpg"
            alt="Logo AdLocal"
            sx={{ width: "100%", maxHeight: 120, objectFit: "fill" }}
          />
        )}
      </Box>

      <Divider />

      <List sx={{ backgroundColor: "#f5e9cf", height: "100%" }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;

          const button = (
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={isMobile ? onCloseMobile : undefined}
              sx={{
                minHeight: 48,
                justifyContent: collapsed ? "center" : "flex-start",
                px: 2.5,
                backgroundColor: isSelected ? "#D2B48C" : "transparent",
                color: isSelected ? "#e8692c" : "inherit",
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                  color: isSelected ? "#e8692c" : "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                sx={{
                  opacity: collapsed ? 0 : 1,
                  width: collapsed ? 0 : "auto",
                  whiteSpace: "nowrap",
                }}
              />
            </ListItemButton>
          );

          return (
            <ListItem key={item.text} disablePadding>
              {collapsed ? (
                <Tooltip title={item.text} placement="right">
                  {button}
                </Tooltip>
              ) : (
                button
              )}
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default UserSidebar;
