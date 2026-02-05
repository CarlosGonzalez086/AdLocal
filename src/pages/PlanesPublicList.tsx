import { Box, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { ListadoPlanesPublicos } from "../components/Plan/ListadoPlanesPublicos";

export default function PlanesPublicList() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        bgcolor: "#F2F2F7",
        overflow: "auto",
      }}
      padding={3}
    >
      <Box
        sx={{
          backdropFilter: "blur(12px)",
          bgcolor: "rgba(242,242,247,0.8)",
        }}
      >
        <Button
          onClick={() => navigate("/login")}
          sx={{
            borderRadius: 999,
            px: 3,
            fontWeight: 600,
            textTransform: "none",
            borderColor: "#007AFF",
            color: "#007AFF",
            "&:hover": {
              bgcolor: "rgba(0,122,255,0.08)",
            },
          }}
          variant="outlined"
          startIcon={<ArrowBackIosNewIcon />}
        >
          Regresar
        </Button>
      </Box>

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: { xs: 4, sm: 6 },
            mb: 4,
          }}
        >
          <Box
            component="img"
            src="https://uzgnfwbztoizcctyfdiv.supabase.co/storage/v1/object/public/Imagenes/WhatsApp%20Image%202025-12-23%20at%2021.19.26.jpeg"
            alt="AdLocal"
            sx={{
              width: { xs: 160, sm: 200 },
              borderRadius: 3,
            }}
          />
        </Box>

        <ListadoPlanesPublicos />
      </Container>
    </Box>
  );
}
