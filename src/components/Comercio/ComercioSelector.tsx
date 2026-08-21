import { MenuItem, Select } from "@mui/material";

interface Props {
  comercios: {
    id: number;
    nombre: string;
  }[];
  value: number;
  onChange: (id: number) => void;
}

export default function ComercioSelector({
  comercios,
  value,
  onChange,
}: Props) {
  if (comercios.length === 0) {
    return null;
  }

  return (
    <div className="commerceSelectorContainer">
      <label
        htmlFor="commerce-selector"
        className="commerceSelectorLabel d-block mb-2 fz-h5 fw-semibold"
      >
        Comercio activo
      </label>

      <Select
        id="commerce-selector"
        fullWidth
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        size="small"
        className="commerceSelector"
      >
        {comercios.map((comercio) => (
          <MenuItem
            key={comercio.id}
            value={comercio.id}
            className="fz-h4 fw-regular"
          >
            {comercio.nombre}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
}
