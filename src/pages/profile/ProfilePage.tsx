import { Card, CardContent, CircularProgress } from "@mui/material";
import { useProfile } from "./useProfile";
import { ProfileHeader } from "../../components/profile/ProfileHeader";

import { ProfileActions } from "../../components/profile/ProfileActions";
import { ProfileForm } from "../../components/profile/ProfileForm";

const ProfilePage = () => {
  const { profile, loading, actualizarPerfil } = useProfile();

  if (loading && !profile) return <CircularProgress />;

  if (!profile) return null;

  return (
    <Card>
      <CardContent>
        <ProfileHeader nombre={profile.nombre} rol={profile.rol} />
        <ProfileForm
          profile={profile}
          onSave={actualizarPerfil}
          loading={loading}
        />
        <ProfileActions />
      </CardContent>
    </Card>
  );
};

export default ProfilePage;
