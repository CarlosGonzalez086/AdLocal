import {
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Box,
  Button,
  Typography,
} from "@mui/material";
import { UserProfileForm } from "./UserProfileForm";
import { useUserProfile } from "../../../hooks/useUserProfile";
import { useNavigate } from "react-router-dom";
import LockIcon from "@mui/icons-material/Lock";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { profile, loading, actualizarPerfil, subirFoto } = useUserProfile();

  if (loading && !profile.id) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
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
        sx={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 4,
          backdropFilter: "blur(14px)",
          background: "rgba(255,255,255,0.9)",
          boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          {/* Header */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ mb: 2, textAlign: "center" }}
          >
            Mi perfil
          </Typography>

          {/* Formulario */}
          <UserProfileForm
            profile={profile}
            onSave={actualizarPerfil}
            onUploadPhoto={subirFoto}
            loading={loading}
          />

          <Divider sx={{ my: 4 }} />

          {/* Seguridad */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              gap: 2,
            }}
          >
            <Typography
              sx={{ color: "text.secondary", fontSize: "0.9rem" }}
            >
              Seguridad de la cuenta
            </Typography>

            <Button
              variant="contained"
              startIcon={<LockIcon />}
              onClick={() => navigate("/app/perfil/cambiar-password")}
              sx={{
                borderRadius: 999,
                px: 3,
                py: 1.2,
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
                alignSelf: { xs: "stretch", sm: "auto" },
              }}
            >
              Cambiar contraseña
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfilePage;
