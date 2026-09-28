import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
} from "@mui/material";
import type { FC } from "react";
import MaterialSymbol from "../../UI/MaterialSymbol/MaterialSymbol";
import { DIAS_SEMANA_MAP } from "../../../utils/constantes";
import type { HorarioComercioDto } from "../../../types/User/comercio";

interface CommerceDetailScheduleProps {
  horarios: HorarioComercioDto[];
}

export const CommerceDetailSchedule: FC<CommerceDetailScheduleProps> = ({
  horarios,
}) => {
  if (horarios.length === 0) return null;

  return (
    <Accordion elevation={0} className="commerceDetailAccordion">
      <AccordionSummary
        className="commerceDetailAccordionSummary"
        expandIcon={<MaterialSymbol icon="expand_more" size="medium" />}
        aria-controls="commerce-schedule-content"
        id="commerce-schedule-div"
      >
        <div className="d-flex align-items-center gap-3">
          <div className="commerceDetailAccordionTitleIcon">
            <MaterialSymbol icon="schedule" size="medium" />
          </div>

          <div>
            <h2 className="commerceDetailAccordionTitle fz-h2 fw-bold mb-1">
              Horarios de atención
            </h2>

            <p className="commerceDetailAccordionSubtitle fz-h4 fw-regular mb-0">
              Consulta los días y horarios disponibles.
            </p>
          </div>
        </div>
      </AccordionSummary>

      <AccordionDetails
        id="commerce-schedule-content"
        className="commerceDetailAccordionDetails"
      >
        <div className="d-flex flex-column gap-2">
          {horarios.map((schedule) => (
            <div
              key={schedule.dia}
              className={`commerceDetailScheduleRow d-flex align-items-center justify-content-between gap-3 ${
                schedule.abierto
                  ? "commerceDetailScheduleRowOpen"
                  : "commerceDetailScheduleRowClosed"
              }`}
            >
              <div className="d-flex align-items-center gap-2">
                <MaterialSymbol
                  icon={schedule.abierto ? "calendar_today" : "event_busy"}
                  size="small"
                />

                <span className="commerceDetailScheduleDayText fz-h4 fw-semibold">
                  {DIAS_SEMANA_MAP[schedule.dia]}
                </span>
              </div>

              {schedule.abierto ? (
                <span className="commerceDetailScheduleTime fz-h4 fw-medium">
                  {schedule.horaAperturaFormateada} –{" "}
                  {schedule.horaCierreFormateada}
                </span>
              ) : (
                <Chip
                  label="Cerrado"
                  size="small"
                  variant="outlined"
                  className="commerceDetailClosedChip"
                />
              )}
            </div>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default CommerceDetailSchedule;
