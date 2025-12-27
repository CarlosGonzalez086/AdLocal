import { MenuItem, Select } from "@mui/material";

interface OrderSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const OrderSelect = ({ value, onChange }: OrderSelectProps) => {
  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      fullWidth
    >
      <MenuItem value="recent">Más recientes</MenuItem>
      <MenuItem value="old">Más antiguos</MenuItem>
      <MenuItem value="az">A - Z</MenuItem>
      <MenuItem value="za">Z - A</MenuItem>
    </Select>
  );
};
