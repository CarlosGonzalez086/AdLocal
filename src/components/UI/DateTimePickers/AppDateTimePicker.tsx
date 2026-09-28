import React from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/es";

export interface AppDateTimePickerProps {
  label?: string;
  value?: string | Dayjs | null;
  onChange: (valueFormatted: string | null, dateTimeObj: Dayjs | null) => void;
  format?: string;
  displayFormat?: string;
  ampm?: boolean;
  minutesStep?: number;
  size?: "small" | "medium";
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: string;
  minDateTime?: string | Dayjs;
  maxDateTime?: string | Dayjs;
  fullWidth?: boolean;
  className?: string;
  clearable?: boolean;
}

export const AppDateTimePicker: React.FC<AppDateTimePickerProps> = ({
  label,
  value,
  onChange,
  format = "YYYY-MM-DDTHH:mm:ss",
  displayFormat = "DD/MM/YYYY hh:mm A",
  ampm = true,
  minutesStep = 15,
  size = "small",
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  minDateTime,
  maxDateTime,
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

  const parsedMinDateTime: Dayjs | undefined = React.useMemo(() => {
    if (!minDateTime) return undefined;
    if (dayjs.isDayjs(minDateTime)) return minDateTime;
    const d = dayjs(minDateTime);
    return d.isValid() ? d : undefined;
  }, [minDateTime]);

  const parsedMaxDateTime: Dayjs | undefined = React.useMemo(() => {
    if (!maxDateTime) return undefined;
    if (dayjs.isDayjs(maxDateTime)) return maxDateTime;
    const d = dayjs(maxDateTime);
    return d.isValid() ? d : undefined;
  }, [maxDateTime]);

  const handleChange = (newValue: Dayjs | null) => {
    if (newValue && newValue.isValid()) {
      onChange(newValue.format(format), newValue);
    } else {
      onChange(null, null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <DateTimePicker
        label={label}
        value={parsedValue}
        onChange={handleChange}
        format={displayFormat}
        ampm={ampm}
        minutesStep={minutesStep}
        disabled={disabled}
        readOnly={readOnly}
        minDateTime={parsedMinDateTime}
        maxDateTime={parsedMaxDateTime}
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
                "&.Mui-selected": {
                  backgroundColor: "#008989 !important",
                  color: "#FFFFFF",
                  fontWeight: 650,
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#008989",
              },
              "& .MuiTab-root.Mui-selected": {
                color: "#008989",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
