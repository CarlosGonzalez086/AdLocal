import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface FeatureProps {
  label: string;
  active: boolean;
}

export const Feature = ({ label, active }: FeatureProps) => {
  return (
    <div className="d-flex align-items-center gap-2">
      {active ? (
        <CheckIcon fontSize="small" className="text-success" />
      ) : (
        <CloseIcon fontSize="small" className="text-danger" />
      )}

      <span className="fz-body-sm text-dark">{label}</span>
    </div>
  );
};
