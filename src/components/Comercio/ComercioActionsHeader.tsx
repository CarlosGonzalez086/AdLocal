import {
  Box,
  Button,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

import type { JwtClaims } from "../../services/auth.api";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import styles from "../../styles/ComercioActionsHeader.module.css";

interface Props {
  claims: JwtClaims | null;
  total: number;
}

export function ComercioActionsHeader({ claims, total }: Props) {
  const parsedMax = Number(claims?.maxNegocios);

  const max =
    Number.isFinite(parsedMax) && parsedMax > 0 ? Math.floor(parsedMax) : 0;

  const totalRegistrados = Math.max(Math.floor(Number(total) || 0), 0);

  const limiteDisponible = max > 0;

  const restantes = limiteDisponible ? Math.max(max - totalRegistrados, 0) : 0;

  const limiteAlcanzado = !limiteDisponible || totalRegistrados >= max;

  const porcentaje = limiteDisponible
    ? Math.min((totalRegistrados / max) * 100, 100)
    : 0;

  const statusMessage = !limiteDisponible
    ? "No fue posible determinar el límite de negocios de tu plan."
    : limiteAlcanzado
      ? "Llegaste al límite de negocios de tu plan actual."
      : `Puedes registrar ${restantes} ${
          restantes === 1 ? "negocio" : "negocios"
        } más.`;

  return (
    <Paper
      component="section"
      elevation={0}
      className={styles.container}
      aria-labelledby="commerce-usage-title"
    >
      <Stack className={styles.layout}>
        <Box className={styles.information}>
          <Box className={styles.header}>
            <Box className={styles.titleContainer}>
              <Box className={styles.titleIcon}>
                <MaterialSymbol icon="storefront" size="medium" filled />
              </Box>

              <Box>
                <Typography
                  id="commerce-usage-title"
                  component="h2"
                  className={styles.title}
                >
                  Negocios registrados
                </Typography>

                <Typography component="p" className={styles.subtitle}>
                  Uso disponible en tu plan actual
                </Typography>
              </Box>
            </Box>

            <Box
              className={[
                styles.counterBadge,
                limiteAlcanzado
                  ? styles.counterBadgeLimit
                  : styles.counterBadgeAvailable,
              ].join(" ")}
            >
              <Typography component="span" className={styles.counterText}>
                {totalRegistrados} / {limiteDisponible ? max : "—"}
              </Typography>
            </Box>
          </Box>

          <Box className={styles.progressContainer}>
            <LinearProgress
              variant="determinate"
              value={porcentaje}
              className={[
                styles.progress,
                limiteAlcanzado
                  ? styles.progressLimit
                  : styles.progressAvailable,
              ].join(" ")}
              aria-label="Uso del límite de negocios"
              aria-valuetext={
                limiteDisponible
                  ? `${totalRegistrados} de ${max} negocios utilizados`
                  : "Límite de negocios no disponible"
              }
            />

            <Box className={styles.progressInformation}>
              <Typography
                component="p"
                className={[
                  styles.statusMessage,
                  limiteAlcanzado ? styles.statusMessageLimit : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <MaterialSymbol
                  icon={limiteAlcanzado ? "info" : "check_circle"}
                  size="small"
                  filled={!limiteAlcanzado}
                />

                <span>{statusMessage}</span>
              </Typography>

              {limiteDisponible && (
                <Typography component="span" className={styles.percentage}>
                  {Math.round(porcentaje)}%
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        <Box className={styles.actionContainer}>
          {!limiteAlcanzado ? (
            <Button
              component={Link}
              to="nuevo"
              variant="contained"
              className={styles.createButton}
              startIcon={<MaterialSymbol icon="add_business" size="small" />}
            >
              Nuevo negocio
            </Button>
          ) : (
            <Button
              type="button"
              variant="outlined"
              disabled
              className={styles.limitButton}
              startIcon={<MaterialSymbol icon="lock" size="small" filled />}
            >
              Límite alcanzado
            </Button>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
