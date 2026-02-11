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
  sidebarWidth: number;
}

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
    "/app/vistaprevia": "Vista previa",
  };

  const path = location.pathname;

  const basePath = path.split("/").slice(0, -1).join("/");
  const isEditar = location.pathname.includes("/editar");

  const basePathPSC = path.split("/").slice(0, -1).join("/");
  const isPSC = location.pathname.includes("/comercios/comercio");

  const basePathPV = path.split("/").slice(0, -1).join("/");
  const isPV = location.pathname.includes("/app/vistaprevia");

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: "blur(18px)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,.92), rgba(250,245,238,.96))",
        borderBottom: "1px solid rgba(0,0,0,.06)",
        color: "#3A2419",

        width: {
          xs: "100%",
          md: `calc(100% - ${sidebarWidth}px)`,
        },
        ml: {
          xs: 0,
          md: `${sidebarWidth}px`,
        },

        transition: "all .35s cubic-bezier(.4,0,.2,1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
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
        <Box display="flex" alignItems="center" gap={1.5}>
          <IconButton
            onClick={isMobile ? onMenuClick : onToggleCollapse}
            sx={{
              width: 42,
              height: 42,
              borderRadius: 3,
              bgcolor: "rgba(0,0,0,.05)",
              "&:hover": { bgcolor: "rgba(0,0,0,.1)" },
            }}
          >
            {isMobile || collapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>

          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.2rem" },
              fontWeight: 800,
              color: "#008989",
            }}
          >
            {isPV
              ? menuTitles[basePathPV]
              : isPSC
                ? menuTitles[basePathPSC]
                : isEditar
                  ? menuTitles[basePath]
                  : (menuTitles[location.pathname] ?? "")}
          </Typography>
        </Box>

        {user && (
          <Box>
            <Chip
              label={user?.rol}
              size="small"
              sx={{
                mr: 1.5,
                px: 1.2,
                height: 26,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: ".03em",
                textTransform: "uppercase",
                color: "#1C1C1E",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,.75), rgba(255,255,255,.55))",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",

                border: "1px solid rgba(0,0,0,.08)",
                borderRadius: "999px",

                boxShadow:
                  "0 4px 10px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.6)",

                transition: "all .25s ease",

                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow:
                    "0 6px 16px rgba(0,0,0,.12), inset 0 1px 0 rgba(255,255,255,.7)",
                },
              }}
            />

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar
                src={showImage ? user.FotoUrl : undefined}
                onError={() => setImgError(true)}
                sx={{
                  width: 38,
                  height: 38,
                  fontWeight: 700,
                  bgcolor: "#E8692C",
                }}
              >
                {!showImage && user.nombre?.[0]}
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
                  backdropFilter: "blur(18px)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,.92), rgba(250,245,238,.96))",
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
