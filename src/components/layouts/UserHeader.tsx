import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Chip,
  ListItemIcon,
} from "@mui/material";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../../context/UserContext ";

interface UserHeaderProps {
  user: User | null;
  onMenuClick: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
  sidebarWidth: number;
}

const menuTitles: Record<string, string> = {
  "/app": "Inicio",
  "/app/comercio": "Mis comercios",
  "/app/plan": "Mi plan",
  "/app/pagos": "Pagos",
  "/app/configuracion": "Configuración",
  "/app/perfil": "Mi perfil",
  "/app/productos-servicios": "Productos y servicios",
  "/app/productos-servicios/comercios": "Productos y servicios de los comercios",
  "/app/productos-servicios/comercios/comercio": "Productos y servicios del comercio",
  "/app/tarjetas": "Tarjetas",
  "/app/comercio/nuevo": "Nuevo comercio",
  "/app/comercio/editar": "Editar comercio",
  "/app/vistaprevia": "Vista previa",
};

const UserHeader = ({
  user,
  onMenuClick,
  onToggleCollapse,
  collapsed,
  sidebarWidth,
}: UserHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);

  const showImage = !!user?.FotoUrl && !imgError;

  const path = location.pathname;
  const basePath = path.split("/").slice(0, -1).join("/");
  const isEditar = path.includes("/editar");
  const isPSC = path.includes("/comercios/comercio");
  const isPV = path.includes("/app/vistaprevia");

  const pageTitle = isPV
    ? menuTitles[basePath]
    : isPSC
      ? menuTitles[basePath]
      : isEditar
        ? menuTitles[basePath]
        : (menuTitles[path] ?? "");

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        background: "rgba(255,255,255,0.82)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        color: "#1c1c1e",
        width: { xs: "100%", md: `calc(100% - ${sidebarWidth}px)` },
        ml: { xs: 0, md: `${sidebarWidth}px` },
        transition: "all .35s cubic-bezier(.4,0,.2,1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 60, md: 68 },
          px: { xs: 1.5, md: 3 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* Left — toggle + título */}
        <Box display="flex" alignItems="center" gap={1.2}>
          <IconButton
            onClick={isMobile ? onMenuClick : onToggleCollapse}
            sx={{
              width: 38,
              height: 38,
              borderRadius: 999,
              bgcolor: "rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.09)",
                transform: "scale(1.05)",
              },
            }}
          >
            {isMobile || collapsed
              ? <MenuRoundedIcon sx={{ fontSize: 20 }} />
              : <ChevronLeftRoundedIcon sx={{ fontSize: 20 }} />
            }
          </IconButton>

          {pageTitle && (
            <Typography
              sx={{
                fontSize: { xs: "0.95rem", md: "1.1rem" },
                fontWeight: 800,
                color: "#008989",
                letterSpacing: "-0.3px",
              }}
            >
              {pageTitle}
            </Typography>
          )}
        </Box>

        {/* Right — rol chip + avatar */}
        {user && (
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={user?.rol}
              size="small"
              sx={{
                px: 1,
                height: 26,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#1c1c1e",
                bgcolor: "rgba(0,0,0,0.06)",
                border: "1px solid rgba(0,0,0,0.08)",
                borderRadius: 999,
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
                display: { xs: "none", sm: "flex" },
              }}
            />

            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ p: 0.5 }}
            >
              <Avatar
                src={showImage ? user.FotoUrl : undefined}
                onError={() => setImgError(true)}
                sx={{
                  width: 36,
                  height: 36,
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  bgcolor: "#E8692C",
                  border: "2px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.06)" },
                }}
              >
                {!showImage && user.nombre?.[0]}
              </Avatar>
            </IconButton>

            {/* Dropdown menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  borderRadius: 3,
                  mt: 1,
                  minWidth: 200,
                  backdropFilter: "blur(20px)",
                  bgcolor: "rgba(255,255,255,0.92)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.16)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  overflow: "hidden",
                },
              }}
            >
              {/* Info usuario */}
              <Box px={2} py={1.5}>
                <Typography fontWeight={700} fontSize="0.875rem" color="text.primary">
                  {user.nombre}
                </Typography>
                <Typography fontSize="0.75rem" color="text.disabled">
                  {user?.rol}
                </Typography>
              </Box>

              <Divider sx={{ opacity: 0.6 }} />

              <MenuItem
                onClick={() => { setAnchorEl(null); navigate("/app/perfil"); }}
                sx={{
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  px: 2,
                  py: 1.2,
                  gap: 1,
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  <PersonOutlineRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                </ListItemIcon>
                Mi perfil
              </MenuItem>

              <Divider sx={{ opacity: 0.6 }} />

              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                sx={{
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  px: 2,
                  py: 1.2,
                  gap: 1,
                  color: "error.main",
                  "&:hover": { bgcolor: "rgba(255,59,48,0.06)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto" }}>
                  <LogoutRoundedIcon sx={{ fontSize: 18, color: "error.main" }} />
                </ListItemIcon>
                Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default UserHeader;