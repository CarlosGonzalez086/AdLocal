import { CircularProgress } from "@mui/material";

import { ProfileHeader } from "./ProfileHeader";
import { ProfileActions } from "./ProfileActions";
import { ProfileForm } from "./ProfileForm";

import { useProfile } from "../../../../hooks/useProfile";

const ProfilePage = () => {
  const { profile, loading, actualizarPerfil } = useProfile();

  if (loading && !profile) {
    return (
      <div className="profileLoading">
        <CircularProgress />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="profilePage">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="profileCard">
              <ProfileHeader nombre={profile.nombre} rol={profile.rol} />

              <hr className="profileDivider" />

              <h2 className="profileSectionTitle fz-h3 fw-semibold">
                Información personal
              </h2>

              <ProfileForm
                profile={profile}
                onSave={actualizarPerfil}
                loading={loading}
              />

              <hr className="profileDivider" />

              <ProfileActions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
