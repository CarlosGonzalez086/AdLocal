import React from "react";
import MaterialSymbol from "./MaterialSymbol/MaterialSymbol";

export type StatusVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"
  | "purple";

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  icon?: string;
  size?: "small" | "medium";
  dot?: boolean;
}

const variantStyles: Record<
  StatusVariant,
  { bg: string; color: string; border: string; dotColor: string }
> = {
  success: {
    bg: "rgba(42, 157, 111, 0.12)",
    color: "#1B734F",
    border: "rgba(42, 157, 111, 0.25)",
    dotColor: "#2A9D6F",
  },
  warning: {
    bg: "rgba(231, 105, 44, 0.12)",
    color: "#B94F1A",
    border: "rgba(231, 105, 44, 0.25)",
    dotColor: "#E7692C",
  },
  error: {
    bg: "rgba(216, 64, 40, 0.12)",
    color: "#B32E18",
    border: "rgba(216, 64, 40, 0.25)",
    dotColor: "#D84028",
  },
  info: {
    bg: "rgba(0, 137, 137, 0.10)",
    color: "#006B6B",
    border: "rgba(0, 137, 137, 0.22)",
    dotColor: "#008989",
  },
  purple: {
    bg: "rgba(245, 158, 11, 0.12)",
    color: "#B45309",
    border: "rgba(245, 158, 11, 0.25)",
    dotColor: "#F59E0B",
  },
  neutral: {
    bg: "rgba(142, 147, 155, 0.12)",
    color: "#545960",
    border: "rgba(142, 147, 155, 0.22)",
    dotColor: "#8E939B",
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = "neutral",
  icon,
  size = "medium",
  dot = false,
}) => {
  const styles = variantStyles[variant] || variantStyles.neutral;
  const isSmall = size === "small";

  return (
    <span
      className="badge-adlocal"
      style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        color: styles.color,
        fontSize: isSmall ? "12px" : "13px",
        padding: isSmall ? "3px 8px" : "5px 12px",
      }}
    >
      {dot && (
        <span
          style={{
            width: isSmall ? 6 : 7,
            height: isSmall ? 6 : 7,
            borderRadius: "50%",
            backgroundColor: styles.dotColor,
            flexShrink: 0,
            display: "inline-block",
          }}
        />
      )}
      {icon && (
        <MaterialSymbol
          icon={icon}
          size="small"
          filled
          style={{ fontSize: isSmall ? 14 : 16 }}
        />
      )}
      <span>{label}</span>
    </span>
  );
};
