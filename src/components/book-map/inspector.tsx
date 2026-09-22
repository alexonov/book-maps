"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Beat, Chapter, Character, Location } from "@/data/types";
import { beatById, chapterById } from "@/lib/beats";
import { MARKER_LABELS } from "@/lib/markers";
import { notesForProgress } from "@/lib/spoiler";
import { ExternalLink, MapPin, X } from "lucide-react";

type InspectorProps = {
  location: Location | null;
  beats: Beat[];
  chapters: Chapter[];
  characters: Character[];
  noteProgressId: string;
  currentSynopsis: string;
  visibleCount: number;
  isCurrent: boolean;
  walkBack: boolean;
  onClear: () => void;
  onMarkHere: (locationId: string) => void;
};

export function Inspector({
  location,
  beats,
  chapters,
  characters,
  noteProgressId,
  currentSynopsis,
  visibleCount,
  isCurrent,
  walkBack,
  onClear,
  onMarkHere,
}: InspectorProps) {
  if (!location) {
    return (
      <div className="flex h-full flex-col gap-4 p-5">
        <h2 className="font-serif text-2xl leading-snug text-[#f0e6d4]">
          Choose a pin
        </h2>
        <p className="text-sm leading-relaxed text-[#c4b49a]">
          Nothing beyond this moment is on the map — not greyed out, not hinted
          at. {visibleCount}{" "}
          {visibleCount === 1 ? "place is" : "places are"} known to you so far.
        </p>
        <Separator className="bg-[#c4a574]/20" />
        <p className="font-serif text-base leading-relaxed text-[#e4d5b8]">
          {currentSynopsis}
        </p>
      </div>
    );
  }

  const revealedAt = beatById(beats, location.revealedIn);
  const revealedChapter = revealedAt
    ? chapterById(chapters, revealedAt.chapterId)
    : undefined;
  const visiblePeople = characters.filter((character) =>
    location.characterIds.includes(character.id),
  );
  const extraNotes = notesForProgress(location, beats, noteProgressId);

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.68rem] tracking-[0.28em] text-[#c4a574] uppercase">
              {MARKER_LABELS[location.type]}
            </p>
            <h2 className="mt-1 font-serif text-2xl leading-tight text-[#f0e6d4]">
              {location.names.en}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClear}
            aria-label="Clear selection"
            className="text-[#c4b49a] hover:text-[#f0e6d4]"
          >
            <X />
          </Button>
        </div>

        <div className="space-y-1 text-sm text-[#d7c7a8]">
          <p>
            <span className="text-[#c4a574]">Catalan · </span>
            {location.names.ca}
          </p>
          <p>
            <span className="text-[#c4a574]">Spanish · </span>
            {location.names.es}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {location.fictional ? (
            <Badge variant="outline">Literary place</Badge>
          ) : (
            <Badge variant="outline">Real Barcelona</Badge>
          )}
          {location.approximate ? (
            <Badge variant="secondary">Approximate</Badge>
          ) : null}
          {location.background ? (
            <Badge variant="secondary">Background</Badge>
          ) : null}
          {isCurrent ? (
            <Badge>Current setting</Badge>
          ) : (
            <Badge variant="secondary">
              {walkBack ? "As of that visit" : "Visited"}
            </Badge>
          )}
        </div>

        {location.address ? (
          <p className="flex items-start gap-2 text-sm text-[#c4b49a]">
            <MapPin className="mt-0.5 size-3.5 shrink-0" />
            <span>
              {location.address}
              {location.neighborhood ? ` · ${location.neighborhood}` : ""}
            </span>
          </p>
        ) : null}

        <p className="font-serif text-base leading-relaxed text-[#f0e6d4]">
          {location.blurb}
        </p>

        {extraNotes.length > 0 ? (
          <ul className="space-y-2 text-sm leading-relaxed text-[#d7c7a8]">
            {extraNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        ) : null}

        {!walkBack && !isCurrent ? (
          <Button
            size="sm"
            variant="outline"
            className="self-start border-[#c4a574]/40 text-[#e8c989]"
            onClick={() => onMarkHere(location.id)}
          >
            I am here
          </Button>
        ) : null}

        <Separator className="bg-[#c4a574]/20" />

        <div>
          <p className="text-[0.68rem] tracking-[0.22em] text-[#c4a574] uppercase">
            First appears
          </p>
          <p className="mt-1 text-sm text-[#e4d5b8]">
            {revealedAt
              ? `${revealedChapter?.part ?? ""} — ${revealedAt.title}`
              : "Unknown moment"}
          </p>
        </div>

        <div>
          <p className="text-[0.68rem] tracking-[0.22em] text-[#c4a574] uppercase">
            Characters present
          </p>
          {visiblePeople.length === 0 ? (
            <p className="mt-1 text-sm text-[#c4b49a]">
              No named characters here yet.
            </p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm text-[#e4d5b8]">
              {visiblePeople.map((person) => (
                <li key={person.id}>
                  <span className="text-[#f0e6d4]">{person.name}</span>
                  <span className="text-[#c4b49a]"> — {person.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {location.osmUrl ? (
            <Button variant="outline" size="sm" className="justify-start" asChild>
              <a href={location.osmUrl} target="_blank" rel="noreferrer">
                <ExternalLink />
                Open in OpenStreetMap
              </a>
            </Button>
          ) : null}
          {location.streetViewUrl ? (
            <Button variant="ghost" size="sm" className="justify-start" asChild>
              <a href={location.streetViewUrl} target="_blank" rel="noreferrer">
                <ExternalLink />
                Look at the street
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </ScrollArea>
  );
}
