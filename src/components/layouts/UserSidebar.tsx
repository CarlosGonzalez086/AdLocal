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
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import StoreRoundedIcon from "@mui/icons-material/StoreRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";

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

const LOGO_FULL =
  "https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg";
const LOGO_ICON =
  "https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/AZuAXHqalTLlz8th7NMdBA-AZuAXHqaHD92HliWBxJzdA.jpg";

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
    claims?.rol === "Comercio" &&
    (claims?.planTipo === "PRO" || claims?.planTipo === "BUSINESS");

  const esRutaBasicaOrFree =
    claims?.rol === "Colaborador" ||
    (claims?.rol === "Comercio" &&
      (claims?.planTipo === "BASIC" || claims?.planTipo === "FREE"));

  const menuItems = [
    { text: "Inicio", icon: <HomeRoundedIcon />, path: "/app" },
    { text: "Mi comercio", icon: <StoreRoundedIcon />, path: "/app/comercio" },
    claims?.rol !== "Colaborador" && {
      text: "Mi plan",
      icon: <EventNoteRoundedIcon />,
      path: "/app/plan",
    },
    claims?.rol !== "Colaborador" && {
      text: "Tarjetas",
      icon: <CreditCardRoundedIcon />,
      path: "/app/tarjetas",
    },
    esRutaComercios && {
      text: "Productos y servicios",
      icon: <CategoryRoundedIcon />,
      path: "/app/productos-servicios/comercios",
    },
    esRutaBasicaOrFree && {
      text: "Productos y servicios",
      icon: <CategoryRoundedIcon />,
      path: "/app/productos-servicios",
    },
  ].filter((x): x is { text: string; icon: JSX.Element; path: string } =>
    Boolean(x),
  );

  const currentWidth = collapsed ? collapsedWidth : drawerWidth;

  const drawerContent = (
    <>
      {/* Logo */}
      <Box
        sx={{
          height: isMobile ? "auto" : 120,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: isMobile ? 3 : 0,
          gap: 1,
        }}
      >
        <Box
          component="img"
          src={collapsed && !isMobile ? LOGO_ICON : LOGO_FULL}
          alt="AdLocal"
          sx={{
            width: collapsed && !isMobile ? 44 : isMobile ? "70%" : "80%",
            maxHeight: collapsed && !isMobile ? 44 : 90,
            borderRadius: collapsed && !isMobile ? "50%" : 3,
            objectFit: "contain",
            transition: "all .35s ease",
            boxShadow:
              collapsed && !isMobile ? "0 6px 18px rgba(0,0,0,0.15)" : "none",
          }}
        />

        {/* Nombre app en mobile */}
        {isMobile && (
          <Typography fontWeight={800} fontSize="1rem" color="#008989">
            ADLocal
          </Typography>
        )}
      </Box>

      <Divider sx={{ opacity: 0.4, mx: 1.5 }} />

      {/* Nav items */}
      <List sx={{ px: 1.2, py: 1.5, flex: 1 }}>
        {menuItems.map((item) => {
          if (!item?.path) return null;
          const isSelected = location.pathname === item.path;

          const content = (
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={isMobile ? onCloseMobile : undefined}
              sx={{
                minHeight: 48,
                mb: 0.6,
                px: collapsed && !isMobile ? 1.4 : 2,
                borderRadius: 999,
                justifyContent:
                  collapsed && !isMobile ? "center" : "flex-start",
                transition: "all .22s ease",
                background: isSelected
                  ? "linear-gradient(135deg, rgba(232,105,44,0.18), rgba(232,105,44,0.10))"
                  : "transparent",
                color: isSelected ? "#E8692C" : "#3A2419",
                boxShadow: isSelected
                  ? "0 4px 14px rgba(232,105,44,0.20)"
                  : "none",
                "&:hover": {
                  background: isSelected
                    ? "linear-gradient(135deg, rgba(232,105,44,0.26), rgba(232,105,44,0.14))"
                    : "rgba(0,0,0,0.04)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed && !isMobile ? 0 : 1.8,
                  color: "inherit",
                  "& svg": { fontSize: 21 },
                }}
              >
                {item.icon}
              </ListItemIcon>

              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: isSelected ? 700 : 500,
                  letterSpacing: "0.1px",
                  noWrap: true,
                }}
                sx={{
                  opacity: collapsed && !isMobile ? 0 : 1,
                  maxWidth: collapsed && !isMobile ? 0 : "100%",
                  transition: "opacity .2s ease, max-width .2s ease",
                  overflow: "hidden",
                }}
              />
            </ListItemButton>
          );

          return (
            <ListItem key={item.path} disablePadding>
              {collapsed && !isMobile ? (
                <Tooltip title={item.text} placement="right" arrow>
                  {content}
                </Tooltip>
              ) : (
                content
              )}
            </ListItem>
          );
        })}
      </List>

      {/* Plan badge al pie */}
      {!collapsed && claims?.planTipo && (
        <Box px={2} pb={2.5}>
          <Box
            sx={{
              px: 2,
              py: 1.2,
              borderRadius: 3,
              bgcolor: "rgba(232,105,44,0.08)",
              border: "1px solid rgba(232,105,44,0.15)",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography fontSize="1rem">
              {claims.planTipo === "FREE"
                ? "🆓"
                : claims.planTipo === "BASIC"
                  ? "⚡"
                  : claims.planTipo === "PRO"
                    ? "🚀"
                    : "💼"}
            </Typography>
            <Box>
              <Typography
                fontSize="0.7rem"
                color="text.disabled"
                fontWeight={500}
              >
                Plan actual
              </Typography>
              <Typography fontSize="0.8rem" fontWeight={700} color="#E8692C">
                {claims.planTipo}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? mobileOpen : true}
      onClose={onCloseMobile}
      sx={{
        width: currentWidth,
        flexShrink: 0,
        // En mobile sube por encima del AppBar, en desktop normal
        zIndex: isMobile
          ? (theme) => theme.zIndex.modal + 1
          : (theme) => theme.zIndex.drawer,
        "& .MuiDrawer-paper": {
          width: currentWidth,
          transition: "width .35s cubic-bezier(.4,0,.2,1)",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderRight: "1px solid rgba(0,0,0,0.06)",
          overflowX: "hidden",
          display: "flex",
          flexDirection: "column",
          zIndex: isMobile
            ? (theme) => theme.zIndex.modal + 1
            : (theme) => theme.zIndex.drawer,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

export default UserSidebar;
