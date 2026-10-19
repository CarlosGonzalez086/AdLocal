import { Switch } from "@mui/material";
import type { FC } from "react";
import { HorarioTimePickers } from "../../../../components/Comercio/HorarioTimePickers";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import type { HorarioComercioDto } from "../../../../types/User/comercio";
import { DIAS_SEMANA } from "../../../../utils/constantes";
import { SectionHeader } from "../../Home/Components/SectionHeader";
import { ComercioZonaHoraria } from "./ComercioZonaHoraria";

interface ComercioTabHorariosProps {
  comercioId: number;
  zonaHoraria: string;
  onZonaHoraria: (zona: string) => void;
  horarios: HorarioComercioDto[];
  editable: boolean;
  updateHorario: (dia: number, changes: Partial<HorarioComercioDto>) => void;
}

export const ComercioTabHorarios: FC<ComercioTabHorariosProps> = ({
  comercioId,
  zonaHoraria,
  onZonaHoraria,
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

      <ComercioZonaHoraria
        comercioId={comercioId}
        actual={zonaHoraria}
        editable={editable}
        onConfirmada={onZonaHoraria}
      />

      <div className="row g-3 g-lg-4">
        {DIAS_SEMANA.map((day) => {
          const schedule = horarios.find((item) => item.dia === day.dia);

          if (!schedule) {
            return null;
          }

          return (
            <div key={day.dia} className="col-12 col-md-6">
              <div
                className={`commerceScheduleCard p-3 p-md-4 rounded-3 border ${
                  schedule.abierto
                    ? "commerceScheduleCardOpen"
                    : "commerceScheduleCardClosed"
                }`}
              >
                <div className="d-flex align-items-center justify-content-between gap-3 pb-2 border-bottom mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="commerceScheduleDayIcon">
                      <MaterialSymbol
                        icon={
                          schedule.abierto ? "event_available" : "event_busy"
                        }
                        size="small"
                      />
                    </div>

                    <h3 className="commerceScheduleDayTitle fz-h5 fw-bold mb-0">
                      {day.label}
                    </h3>
                  </div>

                  <label className="commerceScheduleControl d-flex align-items-center gap-2 mb-0">
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
                      className={`commerceScheduleStatus fz-caption fw-semibold ${
                        schedule.abierto
                          ? "commerceOpenStatus"
                          : "commerceClosedStatus"
                      }`}
                    >
                      {schedule.abierto ? "Abierto" : "Cerrado"}
                    </span>
                  </label>
                </div>

                {schedule.abierto ? (
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
                ) : (
                  <div className="py-2 text-center text-muted fz-caption fw-medium d-flex align-items-center justify-content-center gap-1">
                    <MaterialSymbol icon="bedtime" size="small" />
                    <span>Cerrado durante este día</span>
                  </div>
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
