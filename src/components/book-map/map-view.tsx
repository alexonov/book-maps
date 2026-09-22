"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { Journey, Location } from "@/data/types";

type BookMapViewProps = {
  locations: Location[];
  journeys: Journey[];
  selectedId: string | null;
  currentChapterId: string;
  onSelect: (id: string) => void;
};

function MapLoadingState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#120e0b] text-[#c4a574]">
      <div className="h-10 w-10 animate-pulse rounded-full border border-[#c4a574]/40" />
      <p className="font-serif text-sm tracking-wide">Unfolding Barcelona…</p>
    </div>
  );
}

export function BookMapView(props: BookMapViewProps) {
  const [MapCanvas, setMapCanvas] = useState<ComponentType<BookMapViewProps> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("./map-canvas")
      .then((module) => {
        if (!cancelled) setMapCanvas(() => module.default);
      })
      .catch(() => {
        if (!cancelled) {
          setError("The map failed to load. Refresh the page to try again.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#120e0b] px-6 text-center">
        <p className="font-serif text-sm text-[#c4b49a]">{error}</p>
      </div>
    );
  }

  if (!MapCanvas) return <MapLoadingState />;
  return <MapCanvas {...props} />;
}

export function MapEmptyState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center p-6 md:items-center">
      <div className="pointer-events-auto max-w-sm rounded-lg border border-[#c4a574]/30 bg-[#1a1410]/90 px-4 py-3 text-center shadow-xl backdrop-blur-sm">
        <p className="font-serif text-lg text-[#f0e6d4]">{title}</p>
        <p className="mt-1 text-sm text-[#c4b49a]">{body}</p>
      </div>
    </div>
  );
}
