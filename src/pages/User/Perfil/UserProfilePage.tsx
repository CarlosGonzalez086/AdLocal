import {
  Card,
  CardContent,
  Divider,
  Box,
  Button,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import { UserProfileForm } from "./UserProfileForm";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { profile, loading, actualizarPerfil, subirFoto } = useUserProfile();

  /* ─── LOADING ─── */
  if (loading && !profile.id) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          px: { xs: 1.5, sm: 2 },
          mt: { xs: 2, sm: 4 },
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 520 }}>
          <Skeleton variant="rounded" height={48} sx={{ borderRadius: 3, mb: 2 }} />
          <Skeleton variant="circular" width={96} height={96} sx={{ mx: "auto", mb: 2 }} />
          <Stack spacing={1.5}>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="rounded" height={52} sx={{ borderRadius: "12px" }} />
            ))}
          </Stack>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        px: { xs: 1.5, sm: 2 },
        mt: { xs: 2, sm: 4 },
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 5,
          backdropFilter: "blur(20px)",
          bgcolor: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>

          {/* Header */}
          <Box textAlign="center" mb={3}>
            <Typography
              fontWeight={800}
              fontSize="1.2rem"
              color="text.primary"
              letterSpacing="-0.3px"
            >
              Mi perfil
            </Typography>
            <Typography fontSize="0.78rem" color="text.disabled" mt={0.3}>
              Administra tu información personal
            </Typography>
          </Box>

          {/* Formulario */}
          <UserProfileForm
            profile={profile}
            onSave={actualizarPerfil}
            onUploadPhoto={subirFoto}
            loading={loading}
          />

          <Divider sx={{ my: 3.5, opacity: 0.5 }} />

          {/* Seguridad */}
          <Box
            sx={{
              p: 2.5,
              borderRadius: 4,
              bgcolor: "rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction="row" alignItems="center" spacing={1.2}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 3,
                    bgcolor: "rgba(0,122,255,0.10)",
                    border: "1px solid rgba(0,122,255,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <ShieldRoundedIcon sx={{ fontSize: 18, color: "#007AFF" }} />
                </Box>
                <Box>
                  <Typography fontWeight={700} fontSize="0.875rem" color="text.primary">
                    Seguridad de la cuenta
                  </Typography>
                  <Typography fontSize="0.72rem" color="text.disabled">
                    Actualiza tu contraseña regularmente
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="outlined"
                startIcon={<LockRoundedIcon sx={{ fontSize: 16 }} />}
                onClick={() => navigate("/app/perfil/cambiar-password")}
                sx={{
                  borderRadius: 999,
                  px: 2.5,
                  py: 1,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  textTransform: "none",
                  borderColor: "rgba(0,122,255,0.25)",
                  color: "#007AFF",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(0,122,255,0.06)",
                    borderColor: "rgba(0,122,255,0.40)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Cambiar contraseña
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfilePage;