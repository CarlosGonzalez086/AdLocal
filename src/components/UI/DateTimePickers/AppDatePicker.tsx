import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/es";

export interface AppDatePickerProps {
  label?: string;
  value?: string | Dayjs | null;
  onChange: (valueFormatted: string | null, dateObj: Dayjs | null) => void;
  format?: string;
  displayFormat?: string;
  size?: "small" | "medium";
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
  minDate?: string | Dayjs;
  maxDate?: string | Dayjs;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
  clearable?: boolean;
}

export const AppDatePicker: React.FC<AppDatePickerProps> = ({
  label,
  value,
  onChange,
  format = "YYYY-MM-DD",
  displayFormat = "DD/MM/YYYY",
  size = "small",
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  minDate,
  maxDate,
  fullWidth = true,
  className,
  clearable = true,
}) => {
  const parsedValue: Dayjs | null = React.useMemo(() => {
    if (!value) return null;
    if (dayjs.isDayjs(value)) return value.isValid() ? value : null;
    const d = dayjs(value);
    return d.isValid() ? d : null;
  }, [value]);

  const parsedMinDate: Dayjs | undefined = React.useMemo(() => {
    if (!minDate) return undefined;
    if (dayjs.isDayjs(minDate)) return minDate;
    const d = dayjs(minDate);
    return d.isValid() ? d : undefined;
  }, [minDate]);

  const parsedMaxDate: Dayjs | undefined = React.useMemo(() => {
    if (!maxDate) return undefined;
    if (dayjs.isDayjs(maxDate)) return maxDate;
    const d = dayjs(maxDate);
    return d.isValid() ? d : undefined;
  }, [maxDate]);

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue && newValue.isValid()) {
      onChange(newValue.format(format), newValue);
    } else {
      onChange(null, null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DatePicker
        label={label}
        value={parsedValue}
        onChange={handleChange}
        format={displayFormat}
        disabled={disabled}
        readOnly={readOnly}
        minDate={parsedMinDate}
        maxDate={parsedMaxDate}
        className={className}
        slotProps={{
          textField: {
            size,
            fullWidth,
            error,
            helperText,
            sx: {
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                height: size === "small" ? "42px" : "46px",
                fontSize: "14px",
                backgroundColor: "#FFFFFF",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "rgba(0, 137, 137, 0.4)",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#008989",
                  borderWidth: "1.5px",
                },
              },
              "& .MuiInputLabel-root": {
                fontSize: "14px",
                "&.Mui-focused": {
                  color: "#008989",
                },
              },
              "& .MuiIconButton-root": {
                color: "#008989",
                padding: "6px",
              },
            },
          },
          field: {
            clearable,
          },
          popper: {
            sx: {
              "& .MuiPaper-root": {
                borderRadius: "16px",
                boxShadow: "0 14px 36px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                overflow: "hidden",
              },
              "& .MuiPickersDay-root": {
                borderRadius: "8px",
                fontWeight: 500,
                fontSize: "13px",
                "&.Mui-selected": {
                  backgroundColor: "#008989 !important",
                  color: "#FFFFFF",
                  fontWeight: 650,
                },
                "&.MuiPickersDay-today": {
                  borderColor: "#008989",
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
