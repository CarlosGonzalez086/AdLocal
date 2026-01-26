import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import type { JwtClaims } from "../../services/auth.api";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";

interface Props {
  claims: JwtClaims | null;
  total: number;
}

export function ComercioActionsHeader({ claims, total }: Props) {
  const max = Number(claims?.maxNegocios);
  const restantes = max - total;
  const limiteAlcanzado = restantes <= 0;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: 2.5,
        borderRadius: 3,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
      }}
    >
      <Stack direction="row" alignItems="center">
        {!limiteAlcanzado ? (
          <>
            {" "}
            <Link
              to="nuevo"
              className="d-block"
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                disabled={limiteAlcanzado}
                startIcon={<AddIcon />}
                sx={{
                  ml: "auto",
                  px: 3,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Nuevo
              </Button>
            </Link>
          </>
        ) : (
          <>
            <Link to="" className="d-block" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                disabled={limiteAlcanzado}
                startIcon={<AddIcon />}
                sx={{
                  ml: "auto",
                  px: 3,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Nuevo
              </Button>
            </Link>
          </>
        )}
      </Stack>

      <Box mt={2} display="flex" justifyContent="flex-start">
        <Typography fontSize={13} color="text.secondary">
          {limiteAlcanzado
            ? "Llegaste al límite de negocios de tu plan"
            : `Aún puedes registrar ${restantes} negocios más`}
        </Typography>
      </Box>
    </Paper>
  );
}
