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
import type { JwtClaims } from "../../services/auth.api";
import { jwtDecode } from "jwt-decode";
import type { JSX } from "react";

interface UserSidebarProps {
  drawerWidth: number;
  collapsedWidth?: number;
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const UserSidebar = ({
  drawerWidth,
  collapsedWidth = 76,
  collapsed,
  mobileOpen,
  onCloseMobile,
}: UserSidebarProps) => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;
  const esRutaComercios =
    (claims?.planTipo == "PRO" && claims?.rol == "Comercio") ||
    (claims?.planTipo == "BUSINESS" && claims?.rol == "Comercio");
  console.log(claims);

  const esRutaBasicaOrFree =
    claims?.rol == "Colaborador" ||
    (claims?.rol == "Comercio" && claims?.planTipo == "BASIC") ||
    (claims?.rol == "Comercio" && claims?.planTipo == "FREE");

  const menuItems = [
    { text: "Inicio", icon: <HomeIcon />, path: "/app" },

    { text: "Mi comercio", icon: <StoreIcon />, path: "/app/comercio" },

    claims?.rol !== "Colaborador" && {
      text: "Mi plan",
      icon: <EventNoteIcon />,
      path: "/app/plan",
    },

    claims?.rol !== "Colaborador" && {
      text: "Tarjetas",
      icon: <CreditCardIcon />,
      path: "/app/tarjetas",
    },

    esRutaComercios && {
      text: "Productos y servicios",
      icon: <CategoryIcon />,
      path: "/app/productos-servicios/comercios",
    },
    esRutaBasicaOrFree && {
      text: "Productos y servicios",
      icon: <CategoryIcon />,
      path: "/app/productos-servicios",
    },
  ].filter((x): x is { text: string; icon: JSX.Element; path: string } =>
    Boolean(x),
  );

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
          transition: "width .35s cubic-bezier(.4,0,.2,1)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.92), rgba(250,245,238,.96))",
          backdropFilter: "blur(18px)",
          borderRight: "1px solid rgba(0,0,0,.06)",
        },
      }}
    >
      <Box
        sx={{
          height: isMobile ? 250 : 130,
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          px: 2,
          padding: isMobile ? "16px" : "0px",
          mt: isMobile ? "20px" : "0px",
        }}
      >
        <Box
          component="img"
          src={
            collapsed
              ? "https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/AZuAXHqalTLlz8th7NMdBA-AZuAXHqaHD92HliWBxJzdA.jpg"
              : "https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg"
          }
          alt="AdLocal"
          sx={{
            width: isMobile ? "100%" : collapsed ? 48 : "100%",
            maxHeight: isMobile ? 150 : collapsed ? 48 : 90,
            borderRadius: isMobile ? 10 : collapsed ? "50%" : 3,
            objectFit: "contain",
            transition: "all .35s ease",
            boxShadow: collapsed ? "0 8px 24px rgba(0,0,0,.15)" : "none",
          }}
        />
      </Box>

      <Divider sx={{ opacity: 0.4 }} />

      <List sx={{ px: 1.2, py: 1.2 }}>
        {menuItems.map((item) => {
          if (!item?.path) return null;

          const isSelected = location.pathname === item.path;

          const content = (
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={isMobile ? onCloseMobile : undefined}
              sx={{
                minHeight: 52,
                mb: 0.8,
                px: collapsed ? 1.6 : 2.4,
                borderRadius: 999,
                justifyContent: collapsed ? "center" : "flex-start",
                transition: "all .25s ease",
                background: isSelected
                  ? "linear-gradient(135deg, rgba(232,105,44,.22), rgba(232,105,44,.12))"
                  : "transparent",
                color: isSelected ? "#E8692C" : "#3A2419",
                boxShadow: isSelected
                  ? "0 6px 18px rgba(232,105,44,.25)"
                  : "none",
                "&:hover": {
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(232,105,44,.3), rgba(232,105,44,.15))"
                    : "rgba(0,0,0,.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 2,
                  color: "inherit",
                  fontSize: 22,
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 14,
                  fontWeight: isSelected ? 700 : 600,
                  letterSpacing: ".2px",
                }}
                sx={{
                  opacity: collapsed ? 0 : 1,
                  transition: "opacity .2s ease",
                  whiteSpace: "nowrap",
                }}
              />
            </ListItemButton>
          );

          return (
            <ListItem key={item.text} disablePadding>
              {collapsed ? (
                <Tooltip title={item.text} placement="right">
                  {content}
                </Tooltip>
              ) : (
                content
              )}
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default UserSidebar;
