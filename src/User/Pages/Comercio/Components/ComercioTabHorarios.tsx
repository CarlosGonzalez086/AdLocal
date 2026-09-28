import { Switch } from "@mui/material";
import type { FC } from "react";
import { HorarioTimePickers } from "../../../../components/Comercio/HorarioTimePickers";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import type { HorarioComercioDto } from "../../../../types/User/comercio";
import { DIAS_SEMANA } from "../../../../utils/constantes";
import { SectionHeader } from "../../Home/Components/SectionHeader";

interface ComercioTabHorariosProps {
  horarios: HorarioComercioDto[];
  editable: boolean;
  updateHorario: (dia: number, changes: Partial<HorarioComercioDto>) => void;
}

export const ComercioTabHorarios: FC<ComercioTabHorariosProps> = ({
  horarios,
  editable,
  updateHorario,
}) => {
  return (
    <>
      <div className="mb-4">
        <SectionHeader
          icon="schedule"
          title="Horarios de atención"
          description="Indica los días y las horas de operación del comercio."
        />
      </div>

      <div className="row g-3">
        {DIAS_SEMANA.map((day) => {
          const schedule = horarios.find((item) => item.dia === day.dia);

          if (!schedule) {
            return null;
          }

          return (
            <div key={day.dia} className="col-12 col-xl-6">
              <div
                className={`commerceScheduleCard ${
                  schedule.abierto
                    ? "commerceScheduleCardOpen"
                    : "commerceScheduleCardClosed"
                }`}
              >
                <div className="d-flex align-items-center justify-content-between gap-3 flex-wrap">
                  <div className="d-flex align-items-center gap-2">
                    <div className="commerceScheduleDayIcon">
                      <MaterialSymbol
                        icon={
                          schedule.abierto
                            ? "event_available"
                            : "event_busy"
                        }
                        size="small"
                      />
                    </div>

                    <h3 className="commerceScheduleDayTitle fz-h4 fw-semibold mb-0">
                      {day.label}
                    </h3>
                  </div>

                  <label className="commerceScheduleControl d-flex align-items-center gap-2">
                    <Switch
                      checked={schedule.abierto}
                      disabled={!editable}
                      size="small"
                      onChange={(event) => {
                        const abierto = event.target.checked;

                        updateHorario(day.dia, {
                          abierto,
                          ...(!abierto && {
                            horaApertura: undefined,
                            horaCierre: undefined,
                          }),
                        });
                      }}
                    />

                    <span
                      className={`commerceScheduleStatus fz-h5 fw-semibold ${
                        schedule.abierto
                          ? "commerceOpenStatus"
                          : "commerceClosedStatus"
                      }`}
                    >
                      {schedule.abierto ? "Abierto" : "Cerrado"}
                    </span>
                  </label>
                </div>

                {schedule.abierto && (
                  <HorarioTimePickers
                    horaApertura={schedule.horaApertura}
                    horaCierre={schedule.horaCierre}
                    disabled={!editable}
                    onChange={(horario) => {
                      if (editable) {
                        updateHorario(day.dia, horario);
                      }
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ComercioTabHorarios;
