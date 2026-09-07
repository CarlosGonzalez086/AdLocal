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
        <div className="commerceMapInstructions d-flex align-items-center gap-2">
          <MaterialSymbol icon="touch_app" size="small" />
          <p className="commerceMapInstructionsText fz-h4 fw-regular mb-0">
            Presiona sobre el mapa para colocar o mover el marcador.
          </p>
        </div>
      )}

      <div className="commerceMapContainer">
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

      {hasSelectedLocation && (
        <div className="commerceCoordinates d-flex align-items-center gap-2">
          <MaterialSymbol icon="my_location" size="small" />
          <span className="commerceCoordinatesText fz-h5 fw-medium">
            {lat.toFixed(6)}, {lng.toFixed(6)}
          </span>
        </div>
      )}
    </section>
  );
};

export default ComercioTabUbicacion;
