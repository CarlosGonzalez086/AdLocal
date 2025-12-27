import { Avatar, Box, Typography } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface Props {
  nombre: string;
  rol: string;
}

export const ProfileHeader = ({ nombre, rol }: Props) => (
  <Box display="flex" alignItems="center" gap={2}>
    <Avatar sx={{ width: 64, height: 64 }}>
      <PersonIcon fontSize="large" />
    </Avatar>

    <Box>
      <Typography variant="h6">{nombre}</Typography>
      <Typography variant="body2" color="text.secondary">
        {rol}
      </Typography>
    </Box>
  </Box>
);
