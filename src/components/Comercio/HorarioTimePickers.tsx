import dayjs from "dayjs";
import { AppTimePicker } from "../UI/DateTimePickers";

interface Props {
  horaApertura?: string | null;
  horaCierre?: string | null;
  disabled?: boolean;
  onChange: (horario: { horaApertura?: string; horaCierre?: string }) => void;
}

export function HorarioTimePickers({
  horaApertura,
  horaCierre,
  disabled = false,
  onChange,
}: Props) {
  const apertura = horaApertura ? dayjs(`2000-01-01T${horaApertura}`) : null;
  const cierre = horaCierre ? dayjs(`2000-01-01T${horaCierre}`) : null;
  const rangoInvalido = Boolean(
    apertura && cierre && !cierre.isAfter(apertura)
  );

  return (
    <div className="row g-3 mt-1">
      <div className="col-12 col-sm-6">
        <AppTimePicker
          label="Apertura"
          value={horaApertura}
          disabled={disabled}
          ampm
          minutesStep={15}
          onChange={(timeStr) =>
            onChange({ horaApertura: timeStr || undefined })
          }
        />
      </div>

      <div className="col-12 col-sm-6">
        <AppTimePicker
          label="Cierre"
          value={horaCierre}
          disabled={disabled}
          ampm
          minutesStep={15}
          error={rangoInvalido}
          helperText={
            rangoInvalido
              ? "La hora de cierre debe ser posterior a la apertura."
              : undefined
          }
          onChange={(timeStr) =>
            onChange({ horaCierre: timeStr || undefined })
          }
        />
      </div>
    </div>
  );
}
