import { TextField } from "@mui/material";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

export const SearchInput = ({
  value,
  placeholder = "Buscar...",
  onChange,
}: SearchInputProps) => {
  return (
    <TextField
      size="small"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      fullWidth
    />
  );
};
