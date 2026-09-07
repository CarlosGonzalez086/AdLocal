import type { FC } from "react";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

export interface SectionHeaderProps {
  icon: string;
  title: string;
  description?: string;
  iconFilled?: boolean;
}

export const SectionHeader: FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
  iconFilled = false,
}) => {
  return (
    <div className="divHeader d-flex align-items-start gap-3">
      <div className="divHeaderIcon flex-shrink-0">
        <MaterialSymbol icon={icon} size="medium" filled={iconFilled} />
      </div>

      <div className="divHeaderContent flex-grow-1">
        <h2 className="divTitle fz-h2 fw-bold mb-1">{title}</h2>

        {description && (
          <p className="divDescription fz-h4 fw-regular mb-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default SectionHeader;
