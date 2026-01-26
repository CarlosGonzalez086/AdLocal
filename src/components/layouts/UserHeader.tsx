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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { User } from "../../context/UserContext ";

interface UserHeaderProps {
  user: User | null;
  onMenuClick: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
}

const UserHeader = ({
  user,
  onMenuClick,
  onToggleCollapse,
  collapsed,
}: UserHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);

  const showImage = !!user?.FotoUrl && !imgError;

  const menuTitles: Record<string, string> = {
    "/app": "Inicio",
    "/app/comercio": "Mis comercios",
    "/app/plan": "Mi plan",
    "/app/pagos": "Pagos",
    "/app/configuracion": "Configuración",
    "/app/perfil": "Mi perfil",
    "/app/productos-servicios": "Productos y servicios",
    "/app/productos-servicios/comercios":
      "Productos y servicios de los comercios",
    "/app/productos-servicios/comercios/comercio":
      "Productos y servicios del comercio",
    "/app/tarjetas": "Tarjetas",
    "/app/comercio/nuevo": "Nuevo",
    "/app/comercio/editar": "Editar",
  };

  const getInitials = (nombre?: string) => {
    if (!nombre) return "";
    const words = nombre.trim().split(" ");
    return words.length === 1
      ? words[0][0].toUpperCase()
      : words[0][0].toUpperCase() + words[1][0].toUpperCase();
  };

  const path = location.pathname;
  const basePath = path.split("/").slice(0, -1).join("/");
  const isEditar = location.pathname.includes("/editar");

  const basePathPSC = path.split("/").slice(0, -1).join("/");
  const isPSC = location.pathname.includes("/comercios/comercio");

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(18px)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.88), rgba(245,233,207,.85))",
        borderBottom: "1px solid rgba(0,0,0,.06)",
        color: "#3A2419",
      }}
    >
      <Toolbar
        sx={{
          minHeight: 68,
          px: { xs: 1.5, md: 3 },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT */}
        <Box display="flex" alignItems="center" gap={1.5}>
          <IconButton
            onClick={isMobile ? onMenuClick : onToggleCollapse}
            sx={{
              width: 42,
              height: 42,
              borderRadius: 3,
              bgcolor: "rgba(0,0,0,.05)",
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,.05)",
              transition: "all .2s ease",
              "&:hover": {
                bgcolor: "rgba(0,0,0,.1)",
                transform: "scale(1.05)",
              },
            }}
          >
            {isMobile || collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              fontWeight: 800,
              letterSpacing: ".3px",
              color: "#008989",
              whiteSpace: "nowrap",
            }}
          >
            {isPSC
              ? menuTitles[basePathPSC]
              : isEditar
                ? menuTitles[basePath]
                : (menuTitles[location.pathname] ?? "")}
          </Typography>
        </Box>

        {/* RIGHT */}
        {user && (
          <Box>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar
                src={showImage ? user.FotoUrl : undefined}
                onError={() => setImgError(true)}
                sx={{
                  width: 38,
                  height: 38,
                  fontWeight: 700,
                  bgcolor: "#E8692C",
                  boxShadow:
                    "0 6px 18px rgba(232,105,44,.45), inset 0 0 0 2px rgba(255,255,255,.6)",
                  transition: "transform .2s ease",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                {!showImage && getInitials(user.nombre)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: {
                  borderRadius: 4,
                  mt: 1,
                  minWidth: 200,
                  backdropFilter: "blur(12px)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,.95), rgba(245,233,207,.95))",
                  boxShadow: "0 18px 40px rgba(0,0,0,.25)",
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  navigate("/app/perfil");
                }}
                sx={{ fontWeight: 600 }}
              >
                Mi perfil
              </MenuItem>

              <Divider sx={{ my: 0.5 }} />

              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                sx={{ color: "error.main", fontWeight: 700 }}
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

export default UserHeader;
