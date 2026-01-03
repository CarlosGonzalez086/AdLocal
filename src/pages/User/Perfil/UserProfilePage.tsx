import {
  Card,
  CardContent,
  Divider,
  CircularProgress,
  Typography,
  Box,
  Button,
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
      <div className="d-flex justify-content-center mt-5">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center mt-4 px-2">
      <Card sx={{ maxWidth: 480, width: "100%", borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>

          <UserProfileForm
            profile={profile}
            onSave={actualizarPerfil}
            onUploadPhoto={subirFoto}
            loading={loading}
          />

          <Divider sx={{ my: 3 }} />

          <Box>
            <Box display="flex" justifyContent="flex-end" mt={3}>
              <Button
                variant="contained"
                startIcon={<LockIcon />}
                onClick={() => navigate("/app/perfil/cambiar-password")}
              >
                Cambiar contraseña
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfilePage;
