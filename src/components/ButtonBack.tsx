import { Button } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

interface ButtonBackProps {
  route: string;
}

const ButtonBack = ({ route }: ButtonBackProps) => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate(route)}
      startIcon={<ArrowBackIosNewIcon sx={{ fontSize: "13px !important" }} />}
      sx={{
        textTransform: "none",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "#007AFF",
        px: 2,
        py: 0.8,
        borderRadius: 999,
        border: "1px solid rgba(0,122,255,0.20)",
        transition: "all 0.2s ease",
        "&:hover": {
          bgcolor: "rgba(0,122,255,0.08)",
          borderColor: "rgba(0,122,255,0.35)",
          transform: "translateX(-2px)",
        },
      }}
      variant="outlined"
    >
      Regresar
    </Button>
  );
};

export default ButtonBack;