import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import type { ReactNode } from "react";
import MaterialSymbol from "./UI/MaterialSymbol/MaterialSymbol";
import styles from "../styles/PlanModal.module.css";

interface FeatureSwitchProps {
  checked: boolean;
  disabled: boolean;
  icon: string;
  label: string;
  description: string;
  onChange: (checked: boolean) => void;
  children?: ReactNode;
}

const FeatureSwitch = ({
  checked,
  disabled,
  icon,
  label,
  description,
  onChange,
  children,
}: FeatureSwitchProps) => {
  return (
    <Box
      className={[
        styles.featureCard,
        checked ? styles.featureCardActive : "",
        disabled ? styles.featureCardDisabled : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <FormControlLabel
        className={styles.featureControl}
        control={
          <Switch
            checked={checked}
            disabled={disabled}
            className={styles.featureSwitch}
            onChange={(event) => onChange(event.target.checked)}
          />
        }
        label={
          <Box className={styles.featureLabel}>
            <Box className={styles.featureIcon}>
              <MaterialSymbol icon={icon} size="medium" />
            </Box>

            <Box className={styles.featureText}>
              <Typography component="span" className={styles.featureTitle}>
                {label}
              </Typography>

              <Typography component="p" className={styles.featureDescription}>
                {description}
              </Typography>
            </Box>
          </Box>
        }
      />

      {children && <Box className={styles.featureContent}>{children}</Box>}
    </Box>
  );
};

export default FeatureSwitch;
