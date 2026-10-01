"use client";

import { Button } from "@/components/ui/button";
import type { Location } from "@/data/types";
import { ExternalLink, X } from "lucide-react";
import Image from "next/image";

type InspectorProps = {
  location: Location | null;
  currentSynopsis: string;
  stamp: string | null;
  visibleCount: number;
  isCurrent: boolean;
  isSetting: boolean;
  walkBack: boolean;
  showPhoto: boolean;
  onClear: () => void;
  onMarkHere: (locationId: string) => void;
};

function streetLine(location: Location) {
  const street = location.address?.replace(/\s*\(.*$/, "").trim();
  if (street && location.neighborhood) return `${street}, ${location.neighborhood}`;
  return street || location.neighborhood || "";
}

export function Inspector({
  location,
  currentSynopsis,
  stamp,
  visibleCount,
  isCurrent,
  isSetting,
  walkBack,
  showPhoto,
  onClear,
  onMarkHere,
}: InspectorProps) {
  if (!location) {
    return (
      <div className="flex flex-col gap-5 p-5">
        {stamp ? (
          <p className="font-[family-name:var(--font-cinzel)] text-[0.7rem] tracking-[0.22em] text-[#c4a574] uppercase">
            {stamp}
          </p>
        ) : null}
        <p className="font-serif text-2xl leading-snug text-[#f0e6d4]">
          {currentSynopsis}
        </p>
        <p className="text-sm text-[#9a8b73]">
          {visibleCount}{" "}
          {visibleCount === 1 ? "place" : "places"} on the map so far.
        </p>
      </div>
    );
  }

  const street = streetLine(location);
  const otherNames = [location.names.en, location.names.es].filter(
    (name, index, all) => name && name !== location.names.ca && all.indexOf(name) === index,
  );

  return (
    <div className="flex flex-col">
      <div className="relative">
        {showPhoto && location.photoSrc ? (
          <div className="relative">
            <Image
              key={location.id}
              src={location.photoSrc}
              alt={location.names.ca}
              width={960}
              height={640}
              className="h-52 w-full object-cover lg:h-56"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#120e0b] via-[#120e0b]/70 to-transparent px-5 pt-16 pb-3">
              <h2 className="font-serif text-[1.65rem] leading-tight text-[#f0e6d4]">
                {location.names.ca}
              </h2>
            </div>
          </div>
        ) : (
          <div className="px-5 pt-5 pr-14">
            <h2 className="font-serif text-[1.65rem] leading-tight text-[#f0e6d4]">
              {location.names.ca}
            </h2>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClear}
          aria-label="Close details"
          className="absolute top-3 right-3 bg-[#120e0b]/55 text-[#c4b49a] hover:bg-[#120e0b]/80 hover:text-[#f0e6d4]"
        >
          <X />
        </Button>
      </div>

      <div className="flex flex-col gap-4 px-5 pt-3 pb-6">
        {otherNames.length > 0 ? (
          <p className="text-sm text-[#9a8b73]">{otherNames.join(" · ")}</p>
        ) : null}

        {isSetting && stamp ? (
          <p className="font-[family-name:var(--font-cinzel)] text-[0.7rem] tracking-[0.22em] text-[#e8c989] uppercase">
            {stamp}
          </p>
        ) : null}

        <p className="font-serif text-lg leading-relaxed text-[#f0e6d4]">
          {location.blurb}
        </p>

        {!walkBack && !isCurrent ? (
          <button
            type="button"
            onClick={() => onMarkHere(location.id)}
            className="self-start text-sm text-[#e8c989] underline-offset-4 hover:underline"
          >
            I am here
          </button>
        ) : null}

        <div className="mt-1 space-y-1.5 border-t border-[#c4a574]/15 pt-4 text-[0.7rem] leading-relaxed text-[#7d705c]">
          <p>
            {street ? `${street}. ` : null}
            {location.fictional ? "Literary. " : null}
            {location.approximate ? "Unnumbered. " : null}
            {location.background ? "Heard of, not walked. " : null}
          </p>
          <p className="flex flex-wrap gap-x-3 gap-y-1">
            {location.osmUrl ? (
              <a
                href={location.osmUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#c4b49a]"
              >
                <ExternalLink className="size-3" />
                Map
              </a>
            ) : null}
            {location.streetViewUrl ? (
              <a
                href={location.streetViewUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 hover:text-[#c4b49a]"
              >
                <ExternalLink className="size-3" />
                Street
              </a>
            ) : null}
            {showPhoto && location.photoCredit ? (
              <span>Photo {location.photoCredit}</span>
            ) : null}
          </p>
        </div>
      </div>
    </div>
  );
}
