import { useEffect } from "react";
import { Marker, useMap, useMapEvents } from "react-leaflet";

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

export const LocationPicker = ({
  latitude,
  longitude,
  editable,
  onLocationChange,
}: LocationPickerProps) => {
  const map = useMap();
  const hasPosition = Boolean(latitude && longitude);

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

  return hasPosition ? <Marker position={[latitude, longitude]} /> : null;
};
