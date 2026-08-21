import { Skeleton } from "@mui/material";

import { UserProfileForm } from "./UserProfileForm";

import { useUserProfile } from "../../../hooks/useUserProfile";
import { UserProfileSecurity } from "./UserProfileSecurity";

const UserProfilePage = () => {
  const { profile, loading, actualizarPerfil, subirFoto } = useUserProfile();

  if (loading && !profile.id) {
    return (
      <div className="profilePage">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
              <div className="profileContainer">
                <Skeleton
                  variant="rounded"
                  height={48}
                  className="profileHeaderSkeleton"
                />

                <div className="d-flex justify-content-center my-4">
                  <Skeleton variant="circular" width={96} height={96} />
                </div>

                <div className="d-flex flex-column gap-3">
                  {[1, 2, 3, 4].map((item) => (
                    <Skeleton
                      key={item}
                      variant="rounded"
                      height={52}
                      className="profileFieldSkeleton"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profilePage">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="profileCard">
              <div className="text-center mb-4">
                <h1 className="profileTitle fz-h1 fw-bold mb-1">Mi perfil</h1>

                <p className="profileSubtitle fz-h5 fw-regular mb-0">
                  Administra tu información personal
                </p>
              </div>

              <UserProfileForm
                profile={profile}
                onSave={actualizarPerfil}
                onUploadPhoto={subirFoto}
                loading={loading}
              />

              <hr className="profileDivider" />

              <UserProfileSecurity />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
