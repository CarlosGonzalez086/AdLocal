import type { ReactNode } from "react";

interface Props {
  icon: ReactNode;
  title: string;
  subtitle: string;
  badgeColor?: "teal" | "terracotta" | "amber" | "purple";
  action?: ReactNode;
}

export const ConfigFormHeader = ({
  icon,
  title,
  subtitle,
  badgeColor = "teal",
  action,
}: Props) => {
  return (
    <div className="card-adlocal-header">
      <div className="d-flex align-items-center gap-3">
        <div className={`config-icon-badge config-icon-badge--${badgeColor}`}>
          {icon}
        </div>
        <div>
          <h2
            className="fz-h3 fw-semibold mb-0"
            style={{ color: "#1C1C1E", lineHeight: 1.3 }}
          >
            {title}
          </h2>
          <p
            className="fz-body text-secondary mb-0"
            style={{ fontSize: "13px", lineHeight: 1.4 }}
          >
            {subtitle}
          </p>
        </div>
      </div>
      {action && <div className="d-flex align-items-center gap-2">{action}</div>}
    </div>
  );
};