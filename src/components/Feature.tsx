import {
  Box,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface FeatureProps {
  label: string;
  active: boolean;
}

export const Feature = ({ label, active }: FeatureProps) => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      {active ? (
        <CheckIcon fontSize="small" sx={{ color: "#22C55E" }} />
      ) : (
        <CloseIcon fontSize="small" sx={{ color: "#EF4444" }} />
      )}

      <Typography variant="body2">{label}</Typography>
    </Box>
  );
};
