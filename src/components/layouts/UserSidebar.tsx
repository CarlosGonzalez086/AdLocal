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
    { text: "Tarjetas", icon: <CreditCardIcon />, path: "/app/tarjetas" },
    {
      text: "Productos y Servicios",
      icon: <CategoryIcon />,
      path: "/app/productos-servicios",
    },
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
          transition: "width 0.3s ease",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(245,233,207,0.95))",
          backdropFilter: "blur(14px)",
          borderRight: "1px solid rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          height: 140,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
        }}
      >
        <Box
          component="img"
          src={
            collapsed
              ? "https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/AZuAXHqalTLlz8th7NMdBA-AZuAXHqaHD92HliWBxJzdA.jpg"
              : "https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg"
          }
          alt="Logo AdLocal"
          sx={{
            width: collapsed ? 44 : "100%",
            maxHeight: collapsed ? 44 : 100,
            borderRadius: collapsed ? "50%" : 3,
            objectFit:"contain",
            transition: "all 0.3s ease",
          }}
        />
      </Box>

      <Divider sx={{ opacity: 0.5 }} />

      {/* MENU */}
      <List sx={{ px: 1, py: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;

          const button = (
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={isMobile ? onCloseMobile : undefined}
              sx={{
                minHeight: 48,
                borderRadius: 2,
                mb: 0.5,
                justifyContent: collapsed ? "center" : "flex-start",
                px: collapsed ? 1.5 : 2.5,
                transition: "all 0.25s ease",
                backgroundColor: isSelected
                  ? "rgba(232,105,44,0.15)"
                  : "transparent",
                color: isSelected ? "#e8692c" : "#3A2419",
                "&:hover": {
                  backgroundColor: isSelected
                    ? "rgba(232,105,44,0.2)"
                    : "rgba(0,0,0,0.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                sx={{
                  opacity: collapsed ? 0 : 1,
                  whiteSpace: "nowrap",
                  transition: "opacity 0.2s ease",
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
