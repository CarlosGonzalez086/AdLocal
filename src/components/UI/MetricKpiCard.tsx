import React from "react";
import { Skeleton } from "@mui/material";
import MaterialSymbol from "./MaterialSymbol/MaterialSymbol";

export type KpiColor = "primary" | "success" | "warning" | "error" | "purple";

interface MetricKpiCardProps {
  label: string;
  value: string | number;
  icon: string;
  subtitle?: string;
  color?: KpiColor;
  loading?: boolean;
  onClick?: () => void;
}

const colorMap: Record<KpiColor, { bg: string; color: string; border: string }> = {
  primary: {
    bg: "rgba(0, 137, 137, 0.09)",
    color: "#008989",
    border: "rgba(0, 137, 137, 0.20)",
  },
  success: {
    bg: "rgba(42, 157, 111, 0.10)",
    color: "#2A9D6F",
    border: "rgba(42, 157, 111, 0.20)",
  },
  warning: {
    bg: "rgba(231, 105, 44, 0.10)",
    color: "#E7692C",
    border: "rgba(231, 105, 44, 0.22)",
  },
  error: {
    bg: "rgba(216, 64, 40, 0.10)",
    color: "#D84028",
    border: "rgba(216, 64, 40, 0.22)",
  },
  purple: {
    bg: "rgba(245, 158, 11, 0.10)",
    color: "#D97706",
    border: "rgba(245, 158, 11, 0.22)",
  },
};

export const MetricKpiCard: React.FC<MetricKpiCardProps> = ({
  label,
  value,
  icon,
  subtitle,
  color = "primary",
  loading = false,
  onClick,
}) => {
  const palette = colorMap[color] || colorMap.primary;

  if (loading) {
    return (
      <div className="card-adlocal p-3">
        <div className="d-flex align-items-center gap-3">
          <Skeleton variant="rounded" width={52} height={52} sx={{ borderRadius: "14px" }} />
          <div className="flex-grow-1">
            <Skeleton variant="text" width="60%" height={20} />
            <Skeleton variant="text" width="40%" height={32} sx={{ mt: 0.5 }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`card-adlocal ${onClick ? "card-adlocal--hover cursor-pointer" : ""} p-3 d-flex align-items-center gap-3`}
      style={{
        cursor: onClick ? "pointer" : "default",
      }}
    >
      <div
        className="d-flex align-items-center justify-content-center flex-shrink-0"
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          backgroundColor: palette.bg,
          color: palette.color,
          border: `1px solid ${palette.border}`,
        }}
      >
        <MaterialSymbol icon={icon} size="large" filled />
      </div>

      <div className="flex-grow-1 text-truncate" style={{ minWidth: 0 }}>
        <div
          className="fz-body-sm fw-medium text-truncate mb-1"
          style={{ color: "#6E6E73", lineHeight: 1.2 }}
        >
          {label}
        </div>

        <div
          className="fz-h4 fw-bold"
          style={{ color: "#1C1C1E", lineHeight: 1.15, letterSpacing: "-0.5px" }}
        >
          {value}
        </div>

        {subtitle && (
          <div
            className="fz-caption text-secondary mt-1 text-truncate"
            style={{ color: "#8E8E93", lineHeight: 1.2 }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};
