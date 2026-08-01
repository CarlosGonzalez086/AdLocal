import {
  Box,
  Button,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import { ListadoPlanesPublicos } from "../components/Plan/ListadoPlanesPublicos";
import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";

import styles from "../styles/PlanesPublicList.module.css";

const LOGO_URL =
  "https://pub-d5a2e881682f4782a4be2517d547d3c7.r2.dev/logo-comercio-imagen/WhatsApp%20Image%202025-12-23%20at%2021.19.26%20(1).jpeg";

export default function PlanesPublicList() {
  const navigate = useNavigate();

  return (
    <Box
      component="main"
      className={styles.page}
    >
      <Box
        className={styles.backgroundDecoration}
        aria-hidden="true"
      >
        <Box className={styles.decorationOne} />
        <Box className={styles.decorationTwo} />
      </Box>

      <Box
        component="header"
        className={styles.topBar}
      >
        <Button
          type="button"
          variant="outlined"
          className={styles.backButton}
          onClick={() => navigate("/login")}
          startIcon={
            <MaterialSymbol
              icon="arrow_back_ios_new"
              size="small"
            />
          }
        >
          Regresar
        </Button>
      </Box>

      <Container
        maxWidth="lg"
        className={styles.container}
      >
        <Box className={styles.logoSection}>
          <Box
            component="a"
            href="/"
            className={styles.logoLink}
            aria-label="Ir al inicio de ADLocal"
          >
            <Box
              component="img"
              src={LOGO_URL}
              alt="ADLocal"
              className={styles.logo}
            />
          </Box>
        </Box>

        <Box
          component="section"
          className={styles.plansSection}
          aria-label="Planes disponibles"
        >
          <ListadoPlanesPublicos />
        </Box>
      </Container>
    </Box>
  );
}