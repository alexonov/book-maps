"use client";

import { MARKER_LABELS, MARKER_SYMBOLS } from "@/lib/markers";
import type { MarkerType } from "@/data/types";

const TYPES: MarkerType[] = [
  "bookshop",
  "library",
  "home",
  "street",
  "institution",
  "event",
];

export function MapLegend() {
  return (
    <div className="rounded-lg border border-[#c4a574]/25 bg-[#120e0b]/85 px-3 py-2 text-[0.7rem] text-[#d7c7a8] shadow-lg backdrop-blur-sm">
      <p className="mb-1.5 tracking-[0.2em] text-[#c4a574] uppercase">Legend</p>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
        {TYPES.map((type) => (
          <li key={type} className="flex items-center gap-1.5">
            <span className={`bm-legend-swatch bm-marker--${type}`}>
              {MARKER_SYMBOLS[type]}
            </span>
            {MARKER_LABELS[type]}
          </li>
        ))}
      </ul>
      <p className="mt-1.5 text-[#c4a574]/90">Gold ring = current setting</p>
    </div>
  );
}
