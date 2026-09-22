"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { BARCELONA_CENTER } from "@/data";
import type { Journey, Location } from "@/data/types";
import { MARKER_SYMBOLS } from "@/lib/markers";

type MapCanvasProps = {
  locations: Location[];
  journeys: Journey[];
  selectedId: string | null;
  currentChapterId: string;
  onSelect: (id: string) => void;
};

function FitToStory({
  locations,
  journeys,
}: {
  locations: Location[];
  journeys: Journey[];
}) {
  const map = useMap();

  useEffect(() => {
    const points: L.LatLngExpression[] = locations.map((location) => [
      location.lat,
      location.lng,
    ]);
    for (const journey of journeys) {
      for (const point of journey.path) {
        points.push([point.lat, point.lng]);
      }
    }
    if (points.length === 0) {
      map.setView([BARCELONA_CENTER.lat, BARCELONA_CENTER.lng], 15);
      return;
    }
    map.fitBounds(L.latLngBounds(points), {
      padding: [48, 48],
      maxZoom: 16,
      animate: true,
    });
  }, [journeys, locations, map]);

  return null;
}

function markerIcon(location: Location, selected: boolean, current: boolean) {
  const symbol = MARKER_SYMBOLS[location.type];
  const classes = [
    "bm-marker",
    `bm-marker--${location.type}`,
    selected ? "is-selected" : "",
    current ? "is-current" : "",
    location.background ? "is-background" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return L.divIcon({
    className: classes,
    html: `<span class="bm-marker-core" aria-hidden="true">${symbol}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

export default function MapCanvas({
  locations,
  journeys,
  selectedId,
  currentChapterId,
  onSelect,
}: MapCanvasProps) {
  const icons = useMemo(() => {
    const next = new Map<string, L.DivIcon>();
    for (const location of locations) {
      next.set(
        location.id,
        markerIcon(
          location,
          location.id === selectedId,
          location.activeIn.includes(currentChapterId),
        ),
      );
    }
    return next;
  }, [currentChapterId, locations, selectedId]);

  return (
    <MapContainer
      center={[BARCELONA_CENTER.lat, BARCELONA_CENTER.lng]}
      zoom={15}
      className="book-map h-full w-full"
      zoomControl={false}
      attributionControl
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="bottomleft" />
      {journeys.map((journey) => (
        <Polyline
          key={journey.id}
          positions={journey.path.map((point) => [point.lat, point.lng])}
          pathOptions={{
            color: "#e4c27a",
            weight: 4,
            opacity: 0.95,
            dashArray: "7 9",
          }}
        />
      ))}
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.lat, location.lng]}
          icon={icons.get(location.id)}
          zIndexOffset={
            location.id === selectedId
              ? 1000
              : location.activeIn.includes(currentChapterId)
                ? 400
                : 0
          }
          eventHandlers={{
            click: () => onSelect(location.id),
          }}
        />
      ))}
      <FitToStory locations={locations} journeys={journeys} />
    </MapContainer>
  );
}
