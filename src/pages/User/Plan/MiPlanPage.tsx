import { Typography, Box } from "@mui/material";
import { PlanesUserList } from "../../../components/Plan/PlanesUserList";

const PlanesPage = () => {
  return (
    <div className="container-fluid">
      <Box className="text-center py-4">
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ color: "primary.main" }}
        >
          Elige el plan ideal para ti
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary" }}
          className="mt-2"
        >
          Accede a todas las funcionalidades según el plan que elijas
        </Typography>
      </Box>

      <PlanesUserList />
    </div>
  );
};

export default PlanesPage;
