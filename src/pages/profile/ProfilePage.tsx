import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { useProfile } from "./useProfile";
import { ProfileHeader } from "../../components/profile/ProfileHeader";
import { ProfileActions } from "../../components/profile/ProfileActions";
import { ProfileForm } from "../../components/profile/ProfileForm";

const ProfilePage = () => {
  const { profile, loading, actualizarPerfil } = useProfile();

  if (loading && !profile) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <CircularProgress />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="d-flex justify-content-center mt-4 px-2">
      <Card
        sx={{
          maxWidth: 480,
          width: "100%",
          borderRadius: 2,
          boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <ProfileHeader
            nombre={profile.nombre}
            rol={profile.rol}
          />

          <Divider sx={{ my: 2 }} />

          {/* Información editable */}
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Información personal
          </Typography>

          <ProfileForm
            profile={profile}
            onSave={actualizarPerfil}
            loading={loading}
          />

          <Divider sx={{ my: 3 }} />

          {/* Acciones */}
          <Box>
            <ProfileActions />
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
