"use client";

import { useEffect, useMemo, useRef } from "react";
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
import type { Location } from "@/data/types";
import { MARKER_SYMBOLS } from "@/lib/markers";
import type { BookMapViewProps } from "@/components/book-map/map-view";

function FlyToFocus({
  location,
}: {
  location: Location | null;
}) {
  const map = useMap();
  const first = useRef(true);
  const lastId = useRef<string>("");
  const hadSize = useRef(false);
  const focusId = location?.id ?? "";

  useEffect(() => {
    function frame(target: Location | null, animate: boolean) {
      map.invalidateSize();
      if (!target) {
        map.setView([BARCELONA_CENTER.lat, BARCELONA_CENTER.lng], 15, {
          animate: false,
        });
        return;
      }

      const dest: L.LatLngExpression = [target.lat, target.lng];
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (!animate || reduce) {
        map.setView(dest, 16, { animate: false });
        return;
      }

      map.flyTo(dest, 16, { duration: 0.85 });
    }

    const frameId = window.requestAnimationFrame(() => {
      const shouldAnimate = !first.current && lastId.current !== focusId;
      first.current = false;
      lastId.current = focusId;
      frame(location, shouldAnimate);
    });

    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      const ready = container.clientWidth > 0 && container.clientHeight > 0;
      map.invalidateSize();
      if (ready && !hadSize.current) {
        hadSize.current = true;
        frame(location, false);
      }
    });
    observer.observe(container);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [focusId, location, map]);

  return null;
}

function markerIcon(
  location: Location,
  selected: boolean,
  current: boolean,
  walkBack: boolean,
) {
  const symbol = MARKER_SYMBOLS[location.type];
  const classes = [
    "bm-marker",
    `bm-marker--${location.type}`,
    selected ? "is-selected" : "",
    current ? "is-current" : "",
    walkBack ? "is-walkback" : "",
    location.activeIn.length > 0 ? "is-scene" : "",
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
  focusLocationId,
  walkBack,
  onSelect,
}: BookMapViewProps) {
  const focus = locations.find((location) => location.id === focusLocationId) ?? null;

  const icons = useMemo(() => {
    const next = new Map<string, L.DivIcon>();
    for (const location of locations) {
      next.set(
        location.id,
        markerIcon(
          location,
          location.id === selectedId,
          !walkBack && location.id === focusLocationId,
          walkBack,
        ),
      );
    }
    return next;
  }, [focusLocationId, locations, selectedId, walkBack]);

  return (
    <MapContainer
      center={[BARCELONA_CENTER.lat, BARCELONA_CENTER.lng]}
      zoom={15}
      className={`book-map h-full w-full${walkBack ? " is-walkback" : ""}`}
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
            color: walkBack ? "#f0e6d4" : "#e4c27a",
            weight: walkBack ? 5 : 4,
            opacity: walkBack ? 1 : 0.95,
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
              : location.id === focusLocationId
                ? 400
                : 0
          }
          eventHandlers={{
            click: () => onSelect(location.id),
          }}
        />
      ))}
      <FlyToFocus location={focus} />
    </MapContainer>
  );
}
