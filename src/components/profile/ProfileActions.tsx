import { Box, Button } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";

export const ProfileActions = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="flex-end" mt={3}>
      <Button
        variant="contained"
        startIcon={<LockIcon />}
        onClick={() => navigate("/perfil/cambiar-password")}
      >
        Cambiar contraseña
      </Button>
    </Box>
  );
};
