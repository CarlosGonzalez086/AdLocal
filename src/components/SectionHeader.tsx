import MaterialSymbol from "./UI/MaterialSymbol/MaterialSymbol";

interface SectionHeaderProps {
  icon: string;
  title: string;
  description: string;
}

const SectionHeader = ({ icon, title, description }: SectionHeaderProps) => {
  return (
    <div className="section-header-box">
      <div className="section-header-icon-box">
        <MaterialSymbol icon={icon} size="medium" />
      </div>

      <div className="section-header-text-box">
        <h3 className="section-header-title-text fz-h3 fw-semibold">
          {title}
        </h3>

        <p className="section-header-desc-text fz-h5 fw-regular">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SectionHeader;

