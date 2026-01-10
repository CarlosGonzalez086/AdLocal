import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import type { ComercioDto } from "../../services/comercioApi";

interface Props {
  comercio: ComercioDto;
}

export default function ComercioCard({ comercio }: Props) {
  return (
    <Card
      sx={{
        cursor: "pointer",
        borderRadius: 3, 
        overflow: "hidden",
        position: "relative",
        transition: "all 0.3s ease",
        background: "rgba(255,255,255,0.85)", 
        backdropFilter: "blur(10px)", 
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box
        sx={{
          height: 100,
          background: `linear-gradient(135deg, ${comercio.colorPrimario}, ${comercio.colorSecundario})`, // transparente al 20%
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          src={comercio.logoBase64}
          sx={{
            width: 80,
            height: 80,
            border: "2px solid #fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        />
      </Box>

      <CardContent sx={{ pt: 2 }}>
        <Stack spacing={0.5} alignItems="center">
          <Typography
            variant="h6"
            fontWeight={600}
            textAlign="center"
            sx={{ color: comercio.colorPrimario }}
          >
            {comercio.nombre}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 1 }}
          >
            {comercio.direccion}
          </Typography>

          <Chip
            icon={<PhoneIcon />}
            label={comercio.telefono}
            sx={{
              backgroundColor: comercio.colorSecundario,
              color: "#fff",
              fontWeight: 500,
              px: 2,
              py: 0.5,
              borderRadius: 2,
              fontSize: "0.8rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
