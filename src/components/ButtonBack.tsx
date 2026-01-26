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
      startIcon={<ArrowBackIosNewIcon />}
      sx={{
        textTransform: "none",
        fontSize: 15,
        fontWeight: 500,
        color: "#007AFF",
        padding: "6px 8px",
        borderRadius: "12px",
        "&:hover": {
          backgroundColor: "rgba(0, 122, 255, 0.08)",
        },
      }}
      variant="text"
    >
      Regresar
    </Button>
  );
};

export default ButtonBack;
