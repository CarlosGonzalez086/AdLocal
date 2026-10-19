import type { FC } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import { SectionHeader } from "../../Home/Components/SectionHeader";
import { LocationPicker, MapViewport } from "./ComercioLocationPicker";

interface ComercioTabUbicacionProps {
  editable: boolean;
  lat: number;
  lng: number;
  mapLatitude: number;
  mapLongitude: number;
  hasSelectedLocation: boolean;
  handleLocationChange: (latitude: number, longitude: number) => void;
}

export const ComercioTabUbicacion: FC<ComercioTabUbicacionProps> = ({
  editable,
  lat,
  lng,
  mapLatitude,
  mapLongitude,
  hasSelectedLocation,
  handleLocationChange,
}) => {
  return (
    <section className="commerceSectionCard">
      <SectionHeader
        icon="map"
        title="Ubicación en el mapa"
        description={
          editable
            ? "Selecciona el punto exacto donde se encuentra el comercio."
            : "Ubicación registrada para el comercio."
        }
      />

      {editable && (
        <div className="commerceMapInstructions d-flex align-items-center gap-2 p-3 bg-light rounded-3 mb-3 border">
          <MaterialSymbol icon="touch_app" size="small" />
          <p className="commerceMapInstructionsText fz-body-sm fw-medium text-secondary mb-0">
            Haz clic o toca sobre el mapa para colocar o mover el marcador corporativo de tu negocio.
          </p>
        </div>
      )}

      <div className="commerceMapContainer rounded-3 overflow-hidden border mb-3">
        <MapContainer
          center={[mapLatitude, mapLongitude]}
          zoom={15}
          className="commerceMap"
          dragging={editable}
          scrollWheelZoom={editable}
          doubleClickZoom={editable}
          touchZoom={editable}
          keyboard={editable}
          boxZoom={editable}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapViewport
            latitude={mapLatitude}
            longitude={mapLongitude}
          />

          <LocationPicker
            latitude={lat}
            longitude={lng}
            editable={editable}
            onLocationChange={handleLocationChange}
          />
        </MapContainer>
      </div>

      {hasSelectedLocation ? (
        <div className="commerceCoordinates d-inline-flex align-items-center gap-2 py-2 px-3 bg-light rounded-pill border">
          <MaterialSymbol icon="my_location" size="small" />
          <span className="commerceCoordinatesText fz-caption fw-semibold text-dark">
            Coordenadas seleccionadas: {lat.toFixed(6)}, {lng.toFixed(6)}
          </span>
        </div>
      ) : (
        <div className="d-inline-flex align-items-center gap-2 py-2 px-3 bg-light text-muted rounded-pill border">
          <MaterialSymbol icon="info" size="small" />
          <span className="fz-caption fw-medium">
            Aún no has seleccionado una coordenada en el mapa.
          </span>
        </div>
      )}
    </section>
  );
};

export default ComercioTabUbicacion;
