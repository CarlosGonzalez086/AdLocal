import type { FC } from "react";
import styles from "./MaterialSymbol.module.css";

type IconSize = "small" | "medium" | "large";

interface Props {
  icon: string;
  size?: IconSize;
  filled?: boolean;
  className?: string;
}

const MaterialSymbol: FC<Props> = ({
  icon,
  size = "medium",
  filled = false,
  className = "",
}) => {
  const sizeClass = {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[size];

  return (
    <span
      aria-hidden="true"
      className={[
        styles.icon,
        sizeClass,
        filled ? styles.filled : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon}
    </span>
  );
};

export default MaterialSymbol;
