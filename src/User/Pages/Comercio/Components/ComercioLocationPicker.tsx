import { useEffect, useMemo } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";

export interface LocationPickerProps {
  latitude: number;
  longitude: number;
  editable: boolean;
  onLocationChange: (latitude: number, longitude: number) => void;
}

export interface MapViewportProps {
  latitude: number;
  longitude: number;
}

export const MapViewport = ({ latitude, longitude }: MapViewportProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom(), {
      animate: true,
    });
  }, [latitude, longitude, map]);

  return null;
};

const createAdLocalMarkerIcon = () => {
  return L.divIcon({
    className: "adlocal-svg-marker-container",
    html: `
      <div style="position: relative; width: 38px; height: 50px; display: flex; align-items: center; justify-content: center; filter: drop-shadow(0 5px 8px rgba(0,0,0,0.3)); cursor: pointer;">
        <svg width="38" height="50" viewBox="0 0 38 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="adlocalPinGrad" x1="0" y1="0" x2="38" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#00A8A8" />
              <stop offset="100%" stop-color="#006E6E" />
            </linearGradient>
          </defs>
          <path d="M19 0C8.50659 0 0 8.50659 0 19C0 31.8 16.6 48.3 18.2 49.8C18.7 50.2 19.3 50.2 19.8 49.8C21.4 48.3 38 31.8 38 19C38 8.50659 29.4934 0 19 0Z" fill="url(#adlocalPinGrad)"/>
          <path d="M19 1.5C9.33502 1.5 1.5 9.33502 1.5 19C1.5 30.5 16.9 46 18.5 47.5C18.8 47.8 19.2 47.8 19.5 47.5C21.1 46 36.5 30.5 36.5 19C36.5 9.33502 28.665 1.5 19 1.5Z" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.9"/>
          <circle cx="19" cy="19" r="10.5" fill="#FFFFFF"/>
          <circle cx="19" cy="19" r="6" fill="#E7692C"/>
        </svg>
      </div>
    `,
    iconSize: [38, 50],
    iconAnchor: [19, 50],
    popupAnchor: [0, -48],
  });
};

export const LocationPicker = ({
  latitude,
  longitude,
  editable,
  onLocationChange,
}: LocationPickerProps) => {
  const map = useMap();
  const hasPosition = Boolean(latitude && longitude);
  const markerIcon = useMemo(() => createAdLocalMarkerIcon(), []);

  useMapEvents({
    click(event) {
      if (!editable) {
        return;
      }

      onLocationChange(event.latlng.lat, event.latlng.lng);
      map.panTo(event.latlng, {
        animate: true,
      });
    },
  });

  return hasPosition ? (
    <Marker position={[latitude, longitude]} icon={markerIcon} />
  ) : null;
};
