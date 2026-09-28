import type { FC } from "react";

type IconSize = "small" | "medium" | "large";

interface Props {
  icon: string;
  size?: IconSize;
  filled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MaterialSymbol: FC<Props> = ({
  icon,
  size = "medium",
  filled = false,
  className = "",
  style,
}) => {
  const sizeClass = {
    small: "material-symbol-sm",
    medium: "material-symbol-md",
    large: "material-symbol-lg",
  }[size];

  return (
    <span
      aria-hidden="true"
      style={style}
      className={[
        "material-symbol-icon",
        sizeClass,
        filled ? "material-symbol-filled" : "",
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

