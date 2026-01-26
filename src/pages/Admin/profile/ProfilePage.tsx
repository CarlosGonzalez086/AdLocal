import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Divider,
  Box,
  Container,
} from "@mui/material";
import { useProfile } from "./useProfile";
import { ProfileHeader } from "../../../components/profile/ProfileHeader";
import { ProfileActions } from "../../../components/profile/ProfileActions";
import { ProfileForm } from "../../../components/profile/ProfileForm";

const ProfilePage = () => {
  const { profile, loading, actualizarPerfil } = useProfile();
  if (loading && !profile) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;
  return (
    <Container
      maxWidth="sm"
      sx={{
        mt: { xs: 2, sm: 4 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Card
        elevation={3}
        sx={{
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <ProfileHeader nombre={profile.nombre} rol={profile.rol} />

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Información personal
          </Typography>

          <ProfileForm
            profile={profile}
            onSave={actualizarPerfil}
            loading={loading}
          />

          <Divider sx={{ my: 3 }} />

          <ProfileActions />
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
