import React from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/es";

export interface AppTimePickerProps {
  label?: string;
  value?: string | Dayjs | null;
  onChange: (valueFormatted: string | null, timeObj: Dayjs | null) => void;
  format?: string;
  ampm?: boolean;
  minutesStep?: number;
  size?: "small" | "medium";
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  className?: string;
  clearable?: boolean;
}

export const AppTimePicker: React.FC<AppTimePickerProps> = ({
  label,
  value,
  onChange,
  format = "HH:mm",
  ampm = true,
  minutesStep = 15,
  size = "small",
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  fullWidth = true,
  className,
  clearable = true,
}) => {
  const parsedValue: Dayjs | null = React.useMemo(() => {
    if (!value) return null;
    if (dayjs.isDayjs(value)) return value.isValid() ? value : null;
    // Si viene como "HH:mm" o "HH:mm:ss"
    const parsed = dayjs(`2000-01-01T${value}`);
    return parsed.isValid() ? parsed : null;
  }, [value]);

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue && newValue.isValid()) {
      onChange(newValue.format(format), newValue);
    } else {
      onChange(null, null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <TimePicker
        label={label}
        value={parsedValue}
        onChange={handleChange}
        ampm={ampm}
        minutesStep={minutesStep}
        disabled={disabled}
        readOnly={readOnly}
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
              "& .MuiTimeClock-root": {
                "& .MuiClockPointer-root": {
                  backgroundColor: "#008989",
                },
                "& .MuiClockPointer-thumb": {
                  borderColor: "#008989",
                  backgroundColor: "#008989",
                },
                "& .MuiClock-pin": {
                  backgroundColor: "#008989",
                },
              },
              "& .MuiMenuItem-root.Mui-selected": {
                backgroundColor: "rgba(0, 137, 137, 0.12) !important",
                color: "#008989",
                fontWeight: 650,
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
