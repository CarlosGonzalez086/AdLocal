import { Alert, Skeleton } from "@mui/material";
import type { FC } from "react";
import ComercioCard from "../../../../components/Comercio/ComercioCard";
import ComercioSelector from "../../../../components/Comercio/ComercioSelector";
import ComercioVisitasCharts from "../../../../components/Comercio/ComercioVisitasCharts";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import type { ComercioVisitasStatsDto } from "../../../../services/comercioVisitasApi";
import type { ComercioDtoListItem } from "../../../../types/User/comercio";
import SectionHeader from "./SectionHeader";

interface PreviewCommerceProProps {
  comercios: ComercioDtoListItem[];
  selectedId: number | undefined;
  onSelectCommerce: (id: number) => void;
  stats: ComercioVisitasStatsDto | null;
  loadingStats: boolean;
  statsError: string | null;
}

export const PreviewCommercePro: FC<PreviewCommerceProProps> = ({
  comercios,
  selectedId,
  onSelectCommerce,
  stats,
  loadingStats,
  statsError,
}) => {
  return (
    <div className="mainSections d-flex flex-column gap-4">
      {/* Vista previa de comercios */}
      <div className="previewSection">
        <SectionHeader
          icon="visibility"
          title="Vista previa de comercios"
          description="Consulta cómo se muestran tus negocios en la plataforma pública."
        />

        {comercios.length === 0 ? (
          <div className="emptyCommerceList">
            <MaterialSymbol icon="storefront" size="large" />
            <p className="emptyCommerceListText fz-h4 fw-regular mb-0">
              No hay comercios disponibles para mostrar.
            </p>
          </div>
        ) : (
          <div className="row g-4 commerceGrid">
            {comercios.map((commerceItem) => (
              <div
                key={commerceItem.id}
                className="col-12 col-md-6 col-xl-4"
              >
                <div className="commerceGridItem h-100">
                  <ComercioCard comercio={commerceItem} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <hr className="divDivider" />

      {/* Estadísticas de visitas */}
      <div className="statsSection">
        <SectionHeader
          icon="monitoring"
          title="Estadísticas de visitas"
          description="Analiza el alcance y las visitas que reciben tus comercios."
        />

        <div className="selectorContainer">
          <ComercioSelector
            comercios={comercios}
            value={selectedId ?? 0}
            onChange={onSelectCommerce}
          />
        </div>

        {loadingStats && (
          <div className="statsSkeletons d-flex flex-column gap-3">
            <Skeleton variant="rounded" className="statsSkeleton" />
            <Skeleton variant="rounded" className="statsSkeleton" />
          </div>
        )}

        {statsError && (
          <Alert
            severity="error"
            variant="outlined"
            className="statsError fz-h4 fw-medium"
            icon={<MaterialSymbol icon="warning" size="medium" />}
          >
            {statsError}
          </Alert>
        )}

        {stats && !loadingStats && (
          <div className="chartsContainer">
            <ComercioVisitasCharts
              ultimaSemana={stats.ultimaSemana}
              ultimosTresMeses={stats.ultimosTresMeses}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewCommercePro;
