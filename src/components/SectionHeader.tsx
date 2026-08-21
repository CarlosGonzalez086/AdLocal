import { Box, Typography } from "@mui/material";
import MaterialSymbol from "./UI/MaterialSymbol/MaterialSymbol";
import styles from "../styles/PlanModal.module.css";

interface SectionHeaderProps {
  icon: string;
  title: string;
  description: string;
}

const SectionHeader = ({ icon, title, description }: SectionHeaderProps) => {
  return (
    <Box className={styles.sectionHeader}>
      <Box className={styles.sectionIcon}>
        <MaterialSymbol icon={icon} size="medium" />
      </Box>

      <Box className={styles.sectionHeaderText}>
        <Typography
          component="h3"
          className={`${styles.sectionTitle} fz-h3 fw-semibold`}
        >
          {title}
        </Typography>

        <Typography
          component="p"
          className={`${styles.sectionDescription} fz-h5 fw-regular`}
        >
          {description}
        </Typography>
      </Box>
    </Box>
  );
};

export default SectionHeader;
