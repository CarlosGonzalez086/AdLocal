import { MenuItem, Select } from "@mui/material";

interface OrderSelectProps {
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

export const OrderSelect = ({
  value,
  onChange,
  fullWidth = true,
}: OrderSelectProps) => {
  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value as string)}
      fullWidth={fullWidth}
      sx={{
        borderRadius: "10px",
        backgroundColor: "#FFFFFF",
        height: "42px",
        fontSize: "14px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "rgba(0, 0, 0, 0.12)",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#008989",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#008989",
          borderWidth: "1.5px",
        },
      }}
    >
      <MenuItem value="recent">Más recientes</MenuItem>
      <MenuItem value="old">Más antiguos</MenuItem>
      <MenuItem value="az">A - Z</MenuItem>
      <MenuItem value="za">Z - A</MenuItem>
    </Select>
  );
};
