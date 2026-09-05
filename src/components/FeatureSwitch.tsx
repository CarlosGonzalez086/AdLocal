import { FormControlLabel, Switch, Typography } from "@mui/material";
import type { ReactNode } from "react";
import MaterialSymbol from "./UI/MaterialSymbol/MaterialSymbol";

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
    <div
      className={[
        "feature-card",
        checked ? "feature-card--active" : "",
        disabled ? "feature-card--disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <FormControlLabel
        className="feature-control"
        control={
          <Switch
            checked={checked}
            disabled={disabled}
            className="feature-switch"
            onChange={(event) => onChange(event.target.checked)}
          />
        }
        label={
          <div className="feature-label">
            <div className="feature-icon">
              <MaterialSymbol icon={icon} size="medium" />
            </div>

            <div className="feature-text">
              <Typography component="span" className="feature-title">
                {label}
              </Typography>

              <Typography component="p" className="feature-description">
                {description}
              </Typography>
            </div>
          </div>
        }
      />

      {children && <div className="feature-content">{children}</div>}
    </div>
  );
};

export default FeatureSwitch;

