import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/es";

interface Props {
  horaApertura?: string | null;
  horaCierre?: string | null;
  disabled?: boolean;
  onChange: (horario: { horaApertura?: string; horaCierre?: string }) => void;
}

const parseHora = (hora?: string | null): Dayjs | null =>
  hora ? dayjs(`2000-01-01T${hora}`) : null;

const formatHora = (hora: Dayjs | null): string | undefined =>
  hora?.isValid() ? hora.format("HH:mm") : undefined;

export function HorarioTimePickers({
  horaApertura,
  horaCierre,
  disabled = false,
  onChange,
}: Props) {
  const apertura = parseHora(horaApertura);
  const cierre = parseHora(horaCierre);
  const rangoInvalido = Boolean(
    apertura && cierre && !cierre.isAfter(apertura),
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <div className="row g-3 mt-1">
        <div className="col-12 col-sm-6">
          <TimePicker
            label="Apertura"
            value={apertura}
            disabled={disabled}
            ampm
            minutesStep={15}
            onChange={(value) =>
              onChange({ horaApertura: formatHora(value) })
            }
            slotProps={{
              textField: {
                fullWidth: true,
                className: "commerceTimeInput",
              },
            }}
          />
        </div>

        <div className="col-12 col-sm-6">
          <TimePicker
            label="Cierre"
            value={cierre}
            disabled={disabled}
            ampm
            minutesStep={15}
            onChange={(value) => onChange({ horaCierre: formatHora(value) })}
            slotProps={{
              textField: {
                fullWidth: true,
                error: rangoInvalido,
                helperText: rangoInvalido
                  ? "La hora de cierre debe ser posterior a la apertura."
                  : undefined,
                className: "commerceTimeInput",
              },
            }}
          />
        </div>
      </div>
    </LocalizationProvider>
  );
}
